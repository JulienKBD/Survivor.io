const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../../config/db.js"); // pg.Pool
const router = express.Router();

const {
  createStartup,
  getStartupByEmail,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
  getStartupImage,
} = require("./startups.query.js");

// CREATE startup
router.post("/startups", async (req, res) => {
  const {
    name,
    legal_status,
    address,
    email,
    phone,
    description,
    website_url,
    social_media_url,
    project_status,
    needs,
    sector,
    maturity,
    image,
    founder_id,
  } = req.body;

  if (!name || !legal_status || !address || !email || !phone || !sector || !maturity)
    return res.status(400).json({ msg: "Bad parameter" });

  const client = await pool.connect();
  try {
    await client.query(createStartup, [
      name,
      legal_status,
      address,
      email,
      phone,
      description || "",
      website_url || "",
      social_media_url || "",
      project_status || "Not started",
      needs || "",
      sector,
      maturity,
      image || "",
      founder_id || null,
    ]);

    const { rows } = await client.query(getStartupByEmail, [email]);
    const startup = rows[0];

    const token = jwt.sign({ id: startup.id, name: startup.name }, process.env.SECRET);

    return res.status(201).json({ token, startup });
  } catch (err) {
    console.error("Error creating startup:", err);
    if (err.code === "23505") // duplicate key
      return res.status(409).json({ msg: "Startup already exists" });
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.release();
  }
});

// READ all startups
router.get("/startups", async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(getAllStartups);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching startups:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.release();
  }
});

// READ one startup by id
router.get("/startups/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(getStartupById, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Startup not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.release();
  }
});

// UPDATE startup (full update)
router.put("/startups/:id", async (req, res) => {
  const {
    name,
    legal_status,
    address,
    email,
    phone,
    description,
    website_url,
    social_media_url,
    project_status,
    needs,
    sector,
    maturity,
    image,
    views,
  } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query(updateStartup, [
      name,
      legal_status,
      address,
      email,
      phone,
      description || "",
      website_url || "",
      social_media_url || "",
      project_status || "Not started",
      needs || "",
      sector,
      maturity,
      image || "",
      views || 0,
      req.params.id,
    ]);

    if (result.rowCount === 0)
      return res.status(404).json({ msg: "Startup not found" });

    return res.json({ msg: "Startup updated successfully" });
  } catch (err) {
    console.error("Error updating startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.release();
  }
});

// PATCH (partial update)
router.patch("/startups/:id", async (req, res) => {
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ msg: "No fields to update" });
  }

  const setClauses = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 1}`)
    .join(", ");
  const values = Object.values(fields);

  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE startups SET ${setClauses} WHERE id = $${values.length + 1}`,
      [...values, req.params.id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ msg: "Startup not found" });

    return res.json({ msg: "Startup updated successfully" });
  } catch (err) {
    console.error("Error partially updating startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.release();
  }
});

// GET image
router.get("/startups/:id/image", async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(getStartupImage, [req.params.id]);
    const result = rows[0];

    if (!result) return res.status(404).json({ msg: "Startup not found" });
    if (!result.image) return res.status(404).json({ msg: "No image available" });

    res.setHeader("Content-Type", "image/jpeg");
    return res.send(result.image);
  } catch (err) {
    console.error("Error fetching startup image:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.release();
  }
});

// DELETE
router.delete("/startups/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(deleteStartup, [req.params.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ msg: "Startup not found" });
    return res.json({ msg: "Startup deleted successfully" });
  } catch (err) {
    console.error("Error deleting startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.release();
  }
});

module.exports = router;
