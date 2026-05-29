const { pool } = require('../config/init');
const { body, validationResult, param } = require('express-validator');

exports.getTasks = [
  param('projectId').isInt().withMessage('Invalid project ID'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id: userId } = req.user;
      const { projectId } = req.params;

      // Verify ownership of project
      const projectCheck = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );

      if (projectCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const result = await pool.query(
        'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId]
      );

      res.json({
        success: true,
        tasks: result.rows
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching tasks',
        error: error.message
      });
    }
  }
];

exports.createTask = [
  param('projectId').isInt().withMessage('Invalid project ID'),
  body('title').notEmpty().withMessage('Title is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id: userId } = req.user;
      const { projectId } = req.params;
      const { title, status, due_date } = req.body;

      // Verify ownership of project
      const projectCheck = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );

      if (projectCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const result = await pool.query(
        'INSERT INTO tasks (project_id, title, status, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [projectId, title, status || 'pending', due_date || null]
      );

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating task',
        error: error.message
      });
    }
  }
];

exports.updateTask = [
  param('id').isInt().withMessage('Invalid task ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('status').optional().isIn(['pending', 'completed', 'in_progress']).withMessage('Invalid status'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id: userId } = req.user;
      const { id } = req.params;
      const { title, status, due_date } = req.body;

      // Verify ownership - get task with project info
      const taskCheck = await pool.query(
        `SELECT t.* FROM tasks t 
         JOIN projects p ON t.project_id = p.id 
         WHERE t.id = $1 AND p.user_id = $2`,
        [id, userId]
      );

      if (taskCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (title !== undefined) {
        updates.push(`title = $${paramCount++}`);
        values.push(title);
      }
      if (status !== undefined) {
        updates.push(`status = $${paramCount++}`);
        values.push(status);
      }
      if (due_date !== undefined) {
        updates.push(`due_date = $${paramCount++}`);
        values.push(due_date);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await pool.query(
        `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      res.json({
        success: true,
        message: 'Task updated successfully',
        task: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating task',
        error: error.message
      });
    }
  }
];

exports.deleteTask = [
  param('id').isInt().withMessage('Invalid task ID'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id: userId } = req.user;
      const { id } = req.params;

      // Verify ownership
      const taskCheck = await pool.query(
        `SELECT t.* FROM tasks t 
         JOIN projects p ON t.project_id = p.id 
         WHERE t.id = $1 AND p.user_id = $2`,
        [id, userId]
      );

      if (taskCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting task',
        error: error.message
      });
    }
  }
];
