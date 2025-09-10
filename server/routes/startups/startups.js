const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../../config/db.js");
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
  } = req.body;

  if (!name || !legal_status || !address || !email || !phone || !sector || !maturity)
    return res.status(400).json({ msg: "Bad parameter" });

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(createStartup, [
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
    ]);

    const [startup] = await conn.query(getStartupByEmail, [email]);
    const token = jwt.sign({ id: startup.id, name: startup.name }, process.env.SECRET);

    return res.status(201).json({ token, startup });
  } catch (err) {
    console.error("Error creating startup:", err);
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ msg: "Startup already exists" });
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    if (conn) conn.release();
  }
});

// READ all startups
router.get("/startups", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const startups = await conn.query(getAllStartups);
    return res.json(startups);
  } catch (err) {
    console.error("Error fetching startups:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    if (conn) conn.release();
  }
});

// READ one startup by id
router.get("/startups/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [startup] = await conn.query(getStartupById, [req.params.id]);
    if (!startup) return res.status(404).json({ msg: "Startup not found" });
    return res.json(startup);
  } catch (err) {
    console.error("Error fetching startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    if (conn) conn.release();
  }
});

// UPDATE startup
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
  } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(updateStartup, [
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
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "Startup not found" });
    return res.json({ msg: "Startup updated successfully" });
  } catch (err) {
    console.error("Error updating startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    if (conn) conn.release();
  }
});

// GET image of a startup
router.get("/startups/:id/image", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [result] = await conn.query(getStartupImage, [req.params.id]);

    if (!result) return res.status(404).json({ msg: "Startup not found" });
    if (!result.image) return res.status(404).json({ msg: "No image available" });

    res.setHeader("Content-Type", "image/jpeg");
    return res.send(result.image);
  } catch (err) {
    console.error("Error fetching startup image:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    if (conn) conn.release();
  }
});

// DELETE startup
router.delete("/startups/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(deleteStartup, [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "Startup not found" });
    return res.json({ msg: "Startup deleted successfully" });
  } catch (err) {
    console.error("Error deleting startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
