import pool from "../config/db.js";


export async function reorderJobs(req, res) {
    try {
    const { items } = req.body;
    const columnId = req.params.columnId;
    const userId = req.user.id;
    
    // Verify all items belong to the user and are in the correct column
    const itemIds = items.map(item => item.id);
    const verifyResult = await pool.query(
      `SELECT COUNT(*) FROM jobs 
       WHERE id = ANY($1) AND user_id = $2 AND status = $3`,
      [itemIds, userId, columnId]
    );
    
    if (parseInt(verifyResult.rows[0].count) !== items.length) {
      return res.status(400).json({ error: 'Invalid job items' });
    }
    
    // Update order for each job using a transaction
    await pool.query('BEGIN');
    
    for (let i = 0; i < items.length; i++) {
      await pool.query(
        'UPDATE jobs SET order_index = $1 WHERE id = $2 AND user_id = $3',
        [i, items[i].id, userId]
      );
    }
    
    await pool.query('COMMIT');
    
    return res.json({ message: 'Jobs reordered successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error reordering jobs:', error);
    return res.status(500).json({ error: 'Failed to reorder jobs' });
  }
}