import { Fragment } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { exportProjectPdf } from "../Presentation/Export_pdf";

export default function ViewCard({ open = false, project = null, onClose = () => {}, onExport = null }) {
  const handleExport = async () => {
    if (!project) return;
    try {
      if (typeof onExport === "function") {
        await onExport(project);
      } else {
        await exportProjectPdf(project);
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Erreur lors de l'export PDF — voir la console.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography variant="h6" component="div">
          {project?.title || "Project"}
        </Typography>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button variant="outlined" size="small" onClick={handleExport} disabled={!project}>Export PDF</Button>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers>
        {project ? (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {project.image && (
              <img src={project.image} alt={project.title} style={{ width: 360, height: "auto", borderRadius: 8, objectFit: "cover" }} />
            )}
            <div style={{ flex: 1, minWidth: 240 }}>
              {project.sector && <Typography variant="body1">Sector: {project.sector}</Typography>}
              {project.location && <Typography variant="body1">Location: {project.location}</Typography>}
              {project.age !== undefined && <Typography variant="body1">Age: {project.age} ans</Typography>}
              {project.published && <Typography variant="body2" color="text.secondary">Published: {new Date(project.published).toLocaleDateString()}</Typography>}
              {project.description && <Typography variant="body2" sx={{ mt: 1 }}>{project.description}</Typography>}
            </div>
          </div>
        ) : (
          <Typography variant="body2" color="text.secondary">No project selected.</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} size="small">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export function ProjectView({ project = null, onExport = null, onClose = null }) {
  const handleExport = async () => {
    if (!project) return;
    try {
      if (typeof onExport === "function") {
        await onExport(project);
      } else {
        await exportProjectPdf(project);
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Erreur lors de l'export PDF — voir la console.");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1100, margin: "0 auto", px: 2, py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">{project?.title || "Project"}</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" size="small" onClick={handleExport} disabled={!project}>Export PDF</Button>
          {onClose && <Button variant="contained" size="small" onClick={onClose}>Close</Button>}
        </Box>
      </Box>

      {project ? (
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {project.image && (
            <Box component="img" src={project.image} alt={project.title} sx={{ width: 360, height: "auto", borderRadius: 1, objectFit: "cover" }} />
          )}
          <Box sx={{ flex: 1, minWidth: 280 }}>
            {project.sector && <Typography variant="body1">Sector: {project.sector}</Typography>}
            {project.location && <Typography variant="body1">Location: {project.location}</Typography>}
            {project.age !== undefined && <Typography variant="body1">Age: {project.age} ans</Typography>}
            {project.published && <Typography variant="body2" color="text.secondary">Published: {new Date(project.published).toLocaleDateString()}</Typography>}
            {project.description && <Typography variant="body1" sx={{ mt: 2 }}>{project.description}</Typography>}
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">No project data.</Typography>
      )}
    </Box>
  );
}
