const express = require('express');
const pool = require('../../config/db.js');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  incrementViewProject
} = require('./project.query.js');

// CREATE project
router.post('/projects', async (req, res) => {
  const { title, description, sector, location, age, project_status, image } = req.body;

  if (!title || !description || !sector || !location || !age || !image) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  try {
    const { rows } = await pool.query(createProject, [
      title,
      description,
      sector,
      location,
      age,
      project_status || 'Not started',
      0, // views
      image
    ]);

    const insertedId = rows[0].id;
    const { rows: projectRows } = await pool.query(getProjectById, [insertedId]);
    return res.status(201).json({ project: projectRows[0] });
  } catch (err) {
    console.error('Error creating project:', err);
    if (err.code === '23505') { // unique violation
      return res.status(409).json({ msg: 'Project already exists' });
    }
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// READ all projects
router.get('/projects', async (req, res) => {
  try {
    const { rows } = await pool.query(getAllProjects);
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// READ one project by id
router.get('/projects/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(getProjectById, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ msg: 'Project not found' });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching project:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// UPDATE project
router.put('/projects/:id', async (req, res) => {
  const { title, description, sector, location, age, project_status, views, image } = req.body;

  try {
    const { rowCount } = await pool.query(updateProject, [
      title,
      description,
      sector,
      location,
      age,
      project_status || 'Not started',
      views || 0,
      image || '',
      req.params.id
    ]);

    if (rowCount === 0) return res.status(404).json({ msg: 'Project not found' });
    return res.json({ msg: 'Project updated successfully' });
  } catch (err) {
    console.error('Error updating project:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// DELETE project
router.delete('/projects/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(deleteProject, [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ msg: 'Project not found' });
    return res.json({ msg: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

// INCREMENT project views
router.put('/projects/:id/views', async (req, res) => {
  try {
    const { rowCount } = await pool.query(incrementViewProject, [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ msg: 'Project not found' });

    const { rows } = await pool.query(getProjectById, [req.params.id]);
    return res.json({ success: true, project: rows[0] });
  } catch (err) {
    console.error('Error incrementing views:', err);
    res.status(500).json({ error: 'Failed to increment views' });
  }
});

module.exports = router;
