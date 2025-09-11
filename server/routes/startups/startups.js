const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../../config/db.js");
const router = express.Router();
require('dotenv').config();

const {
  createStartup,
  getStartupByEmail,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup
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

  try {
    const result = await pool.query(createStartup, [
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

    const { rows } = await pool.query(getStartupByEmail, [email]);
    const startup = rows[0];
    const token = jwt.sign({ id: startup.id, name: startup.name }, process.env.SECRET);

    return res.status(201).json({ token, startup });
  } catch (err) {
    console.error("Error creating startup:", err);
    if (err.code === "23505")
      return res.status(409).json({ msg: "Startup already exists" });
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// READ all startups
router.get("/startups", async (req, res) => {
  try {
    const { rows } = await pool.query(getAllStartups);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching startups:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// READ one startup by id
router.get("/startups/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(getStartupById, [req.params.id]);
    const startup = rows[0];
    if (!startup) return res.status(404).json({ msg: "Startup not found" });
    return res.json(startup);
  } catch (err) {
    console.error("Error fetching startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// UPDATE startup
router.put("/:id", async (req, res) => {
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

  try {
    const result = await pool.query(updateStartup, [
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

    if (result.rowCount === 0)
      return res.status(404).json({ msg: "Startup not found" });
    return res.json({ msg: "Startup updated successfully" });
  } catch (err) {
    console.error("Error updating startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// DELETE startup
router.delete("/startups/:id", async (req, res) => {
  try {
    const result = await pool.query(deleteStartup, [req.params.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ msg: "Startup not found" });
    return res.json({ msg: "Startup deleted successfully" });
  } catch (err) {
    console.error("Error deleting startup:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
