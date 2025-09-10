import * as React from 'react';
import Navbar from "../components/Navbar";
import UsersTable from "../components/AdminPanel/UsersTable";
import StartupsTable from "../components/AdminPanel/StartupsTable";
import ProjectsTable from "../components/AdminPanel/ProjectsTable";
import { Box } from "@mui/material";

export default function AdminPanel() {
  return (
    <main>
      <Navbar />

      <Box sx={{ mt: 15, mb: 15 }}>
        <UsersTable />
      </Box>

      <Box sx={{ mt: 15, mb: 15 }}>
        <StartupsTable />
      </Box>

      <Box sx={{ mt: 15, mb: 15 }}>
        <ProjectsTable />
      </Box>
    </main>
  );
}
