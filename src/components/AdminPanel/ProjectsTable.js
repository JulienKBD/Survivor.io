"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Button,
} from "@mui/material";

export default function ProjectsTable() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.RENDER_URL}/projects`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Could not load projects.");
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.RENDER_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Supprime du state
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Could not delete project.");
    }
  };

  return (
    <main>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mt: 4, mb: 2, fontWeight: "bold" }}
      >
        Projects List
      </Typography>

      {error && (
        <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ maxWidth: "95%", mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Sector</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Age</strong></TableCell>
              <TableCell><strong>Published</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Views</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.id}</TableCell>
                <TableCell>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  ) : "-"}
                </TableCell>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.sector}</TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.age}</TableCell>
                <TableCell>{new Date(project.published).toLocaleString()}</TableCell>
                <TableCell>{project.project_status}</TableCell>
                <TableCell>{project.views}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  );
}
