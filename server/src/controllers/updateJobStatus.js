import pool from "../config/db.js";


export async function updateJobStatus(req, res) {
    try {
    const jobId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;
    
    // When moving to a new column, set order_index to the end
    if (status) {
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM jobs WHERE user_id = $1 AND status = $2',
        [userId, status]
      );
      
      const orderIndex = parseInt(countResult.rows[0].count);
      
      const result = await pool.query(
        `UPDATE jobs 
         SET status = $1, order_index = $2 
         WHERE id = $3 AND user_id = $4 
         RETURNING id, title, company, role, status`,
        [status, orderIndex, jobId, userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }
      
      return res.json(result.rows[0]);
    }
    
    return res.status(400).json({ error: 'No update data provided' });
  } catch (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({ error: 'Failed to update job' });
  }
}