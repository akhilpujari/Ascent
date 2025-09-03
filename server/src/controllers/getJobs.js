import pool from "../config/db.js";


export async function getJobs(req, res) {
    try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT id, title, company, role, status 
       FROM jobs 
       WHERE user_id = $1 
       ORDER BY status, order_index, created_at`,
      [userId]
    );
    
    // Format the data to match React state structure
    const columns = {
      wishlist: { items: [] },
      applied: { items: [] },
      onlineAssessment: { items: [] },
      interview: { items: [] },
      selected: { items: [] },
      rejected: { items: [] }
    };
    
    result.rows.forEach(job => {
      columns[job.status].items.push({
        id: job.id.toString(),
        title: job.title,
        company: job.company,
        role: job.role
      });
    });
    
    return res.json(columns);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
}