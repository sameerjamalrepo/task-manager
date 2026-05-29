const { pool } = require('../config/init');
const { body, validationResult, param } = require('express-validator');

exports.getProjects = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      projects: result.rows
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

exports.createProject = [
  body('title').notEmpty().withMessage('Title is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id: userId } = req.user;
      const { title, description } = req.body;

      const result = await pool.query(
        'INSERT INTO projects (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
        [userId, title, description || '']
      );

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating project',
        error: error.message
      });
    }
  }
];

exports.updateProject = [
  param('id').isInt().withMessage('Invalid project ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id: userId } = req.user;
      const { id } = req.params;
      const { title, description } = req.body;

      // Check ownership
      const checkResult = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (title !== undefined) {
        updates.push(`title = $${paramCount++}`);
        values.push(title);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramCount++}`);
        values.push(description);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await pool.query(
        `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      res.json({
        success: true,
        message: 'Project updated successfully',
        project: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating project',
        error: error.message
      });
    }
  }
];

exports.deleteProject = [
  param('id').isInt().withMessage('Invalid project ID'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id: userId } = req.user;
      const { id } = req.params;

      // Check ownership
      const checkResult = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      await pool.query('DELETE FROM projects WHERE id = $1', [id]);

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting project',
        error: error.message
      });
    }
  }
];

exports.getProject = [
  param('id').isInt().withMessage('Invalid project ID'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id: userId } = req.user;
      const { id } = req.params;

      const result = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.json({
        success: true,
        project: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching project',
        error: error.message
      });
    }
  }
];
