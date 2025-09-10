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
} from "@mui/material";

export default function StartupsTable() {
  const [startups, setStartups] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch("http://localhost:3001/startups", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch startups");
        }

        const data = await response.json();
        setStartups(data);
      } catch (err) {
        console.error("Error fetching startups:", err);
        setError("Could not load startups.");
      }
    };

    fetchStartups();
  }, []);

  return (
    <main>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mt: 4, mb: 2, fontWeight: "bold" }}
      >
        Startups List
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
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Legal Status</strong></TableCell>
              <TableCell><strong>Address</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Website</strong></TableCell>
              <TableCell><strong>Social Media</strong></TableCell>
              <TableCell><strong>Project Status</strong></TableCell>
              <TableCell><strong>Needs</strong></TableCell>
              <TableCell><strong>Sector</strong></TableCell>
              <TableCell><strong>Maturity</strong></TableCell>
              <TableCell><strong>Founders</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Founder ID</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {startups.map((startup) => (
              <TableRow key={startup.id}>
                <TableCell>{startup.id}</TableCell>
                <TableCell>{startup.name}</TableCell>
                <TableCell>{startup.legal_status}</TableCell>
                <TableCell>{startup.address}</TableCell>
                <TableCell>{startup.email}</TableCell>
                <TableCell>{startup.phone}</TableCell>
                <TableCell>{startup.description}</TableCell>
                <TableCell>
                  {startup.website_url ? (
                    <a href={startup.website_url} target="_blank" rel="noopener noreferrer">
                      {startup.website_url}
                    </a>
                  ) : "-"}
                </TableCell>
                <TableCell>
                  {startup.social_media_url ? (
                    <a href={startup.social_media_url} target="_blank" rel="noopener noreferrer">
                      {startup.social_media_url}
                    </a>
                  ) : "-"}
                </TableCell>
                <TableCell>{startup.project_status}</TableCell>
                <TableCell>{startup.needs}</TableCell>
                <TableCell>{startup.sector}</TableCell>
                <TableCell>{startup.maturity}</TableCell>
                <TableCell>{startup.founders}</TableCell>
                <TableCell>
                  {startup.image ? (
                    <img
                      src={startup.image}
                      alt={startup.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  ) : "-"}
                </TableCell>
                <TableCell>{startup.founder_id}</TableCell>
                <TableCell>{new Date(startup.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  );
}
