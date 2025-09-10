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

  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(createProject, [
      title,
      description,
      sector,
      location,
      age,
      project_status || 'Not started',
      0, // views
      image
    ]);

    const insertedId = result.insertId;
    const [project] = await conn.query(getProjectById, [insertedId]);

    return res.status(201).json({ project });
  } catch (err) {
    console.error('Error creating project:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ msg: 'Project already exists' });
    }
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// READ all projects
router.get('/projects', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const projects = await conn.query(getAllProjects);
    return res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// READ one project by id
router.get('/projects/:id', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [project] = await conn.query(getProjectById, [req.params.id]);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    return res.status(200).json(project); // ✅ status corrigé
  } catch (err) {
    console.error('Error fetching project:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// UPDATE project
router.put('/projects/:id', async (req, res) => {
  const { title, description, sector, location, age, project_status, views, image } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(updateProject, [
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

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    return res.json({ msg: 'Project updated successfully' });
  } catch (err) {
    console.error('Error updating project:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// DELETE project
router.delete('/projects/:id', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(deleteProject, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    return res.json({ msg: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// INCREMENT project views
router.put("/projects/:id/views", async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(incrementViewProject, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const [project] = await conn.query(getProjectById, [id]);
    return res.json({ success: true, project });
  } catch (err) {
    console.error("Error incrementing views:", err);
    res.status(500).json({ error: "Failed to increment views" });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
