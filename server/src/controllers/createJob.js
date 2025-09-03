import pool from "../config/db.js";


export async function createJob(req, res) {
    try {
    const userId = req.user.id;
    const { title, company, role } = req.body;
    
    if (!title || !company) {
      return res.status(400).json({ error: 'Title and company are required' });
    }
    
    // Get count of existing jobs in wishlist to set order_index
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM jobs WHERE user_id = $1 AND status = $2',
      [userId, 'wishlist']
    );
    
    const orderIndex = parseInt(countResult.rows[0].count);
    
    const result = await pool.query(
      `INSERT INTO jobs (user_id, title, company, role, order_index) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, title, company, role, status`,
      [userId, title, company, role, orderIndex]
    );
    
    return res.status(201).json({
      id: result.rows[0].id.toString(),
      title: result.rows[0].title,
      company: result.rows[0].company,
      role: result.rows[0].role
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ error: 'Failed to create job' });
  }
}