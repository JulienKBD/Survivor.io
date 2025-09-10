const createProject = `
  INSERT INTO projects
  (title, description, sector, location, age, project_status, views, image)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

const getAllProjects = `SELECT * FROM projects`;

const getProjectById = `SELECT * FROM projects WHERE id = ?`;

const updateProject = `
  UPDATE projects
  SET title = ?, description = ?, sector = ?, location = ?, age = ?,
  project_status = ?, views = ?, image = ?
  WHERE id = ?
`;

const deleteProject = `DELETE FROM projects WHERE id = ?`;

const incrementViewProject = `
  UPDATE projects
  SET views = views + 1 WHERE id = ?
`;

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  incrementViewProject
};
