import pool from "../config/db.js";


export async function analytics(req, res) {
    try {
    const userId = req.user.id;
    
    // Get jobs data
    const jobsResult = await pool.query(
      `SELECT id, title, company, role, status, created_at 
       FROM jobs 
       WHERE user_id = $1 
       ORDER BY created_at`,
      [userId]
    );
    
    const jobs = jobsResult.rows;
    
    // Calculate analytics data
    const statusCounts = {
      wishlist: jobs.filter(job => job.status === 'wishlist').length,
      applied: jobs.filter(job => job.status === 'applied').length,
      onlineAssessment: jobs.filter(job => job.status === 'onlineAssessment').length,
      interview: jobs.filter(job => job.status === 'interview').length,
      selected: jobs.filter(job => job.status === 'selected').length,
      rejected: jobs.filter(job => job.status === 'rejected').length
    };
    
    const totalApplications = jobs.length;
    const successRate = totalApplications > 0 
      ? (statusCounts.selected / totalApplications * 100).toFixed(1) 
      : 0;
    
    // Prepare status data for pie chart
    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: getStatusColor(status)
    }));
    
    // Prepare timeline data (last 6 months)
    const timelineData = getTimelineData(jobs);
    
    // Prepare company distribution data
    const companyData = getCompanyData(jobs);
    
    return res.json({
      statusCounts,
      totalApplications,
      successRate,
      statusData,
      timelineData,
      companyData,
      jobs // Include raw jobs data for additional calculations
    });
    
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
}



// Helper function to get status color
function getStatusColor(status) {
  const colors = {
    wishlist: '#3B82F6',
    applied: '#F59E0B',
    onlineAssessment: '#8B5CF6',
    interview: '#F97316',
    selected: '#10B981',
    rejected: '#EF4444'
  };
  return colors[status] || '#888888';
}

// Helper function to generate timeline data
function getTimelineData(jobs) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const last6Months = [];
  const currentDate = new Date();
  
  // Generate last 6 months labels
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    last6Months.push({
      name: months[date.getMonth()],
      year: date.getFullYear(),
      month: date.getMonth(),
      applications: 0,
      interviews: 0
    });
  }
  
  // Count applications and interviews by month
  jobs.forEach(job => {
    const jobDate = new Date(job.created_at);
    const monthIndex = last6Months.findIndex(m => 
      m.month === jobDate.getMonth() && m.year === jobDate.getFullYear()
    );
    
    if (monthIndex !== -1) {
      last6Months[monthIndex].applications++;
      
      // Count interviews (status is interview or beyond)
      if (['interview', 'selected', 'rejected'].includes(job.status)) {
        last6Months[monthIndex].interviews++;
      }
    }
  });
  
  return last6Months.map(({ name, applications, interviews }) => ({
    name,
    applications,
    interviews
  }));
}

// Helper function to get company distribution
function getCompanyData(jobs) {
  const companyMap = {};
  
  jobs.forEach(job => {
    if (companyMap[job.company]) {
      companyMap[job.company]++;
    } else {
      companyMap[job.company] = 1;
    }
  });
  
  // Convert to array and sort by count
  const companyArray = Object.entries(companyMap)
    .map(([name, applications]) => ({ name, applications }))
    .sort((a, b) => b.applications - a.applications);
  
  // Group smaller companies into "Others"
  if (companyArray.length > 5) {
    const topCompanies = companyArray.slice(0, 4);
    const otherCompanies = companyArray.slice(4);
    const otherCount = otherCompanies.reduce((sum, company) => sum + company.applications, 0);
    
    return [...topCompanies, { name: 'Others', applications: otherCount }];
  }
  
  return companyArray;
}

