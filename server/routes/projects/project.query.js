const createProject = `
  INSERT INTO projects
  (title, description, sector, location, age, project_status, views, image)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING id
`;

const getAllProjects = `
  SELECT * FROM projects
`;

const getProjectById = `
  SELECT * FROM projects WHERE id = $1
`;

const updateProject = `
  UPDATE projects
  SET title = $1, description = $2, sector = $3, location = $4, age = $5,
      project_status = $6, views = $7, image = $8
  WHERE id = $9
`;

const deleteProject = `
  DELETE FROM projects WHERE id = $1
`;

const incrementViewProject = `
  UPDATE projects
  SET views = views + 1
  WHERE id = $1
`;

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  incrementViewProject
};
