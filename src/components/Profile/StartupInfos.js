import * as React from "react";
import { Typography, Button, Stack, TextField, IconButton } from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: { width: "450px" },
}));

export default function StartupInfos({ user, token, setGlobalError, setLoading }) {
  const [startup, setStartup] = React.useState(null);
  const [editingField, setEditingField] = React.useState(null);
  const [tempValue, setTempValue] = React.useState("");

  const fetchStartup = async (startupId) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:3001/startups/${startupId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStartup(data);
      } else {
        setGlobalError("Failed to fetch startup info");
      }
    } catch (error) {
      console.error("Error fetching startup:", error);
      setGlobalError("An error occurred while fetching startup info.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user?.role === "founder") {
      fetchStartup(user.id);
    }
  }, [user]);

  const handleEdit = (field, value) => {
    setEditingField(field);
    setTempValue(value || "");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/${startup.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [editingField]: tempValue }),
      });

      if (response.ok) {
        setStartup((prev) => ({ ...prev, [editingField]: tempValue }));
        setEditingField(null);
      } else {
        setGlobalError("Failed to update startup info");
      }
    } catch (error) {
      console.error("Error updating startup:", error);
      setGlobalError("An error occurred while updating startup info.");
    }
  };

  if (user?.role !== "founder" || !startup) return null;

  const fields = [
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Phone", field: "phone" },
    { label: "Address", field: "address" },
    { label: "Website", field: "website_url" },
    { label: "Social Media", field: "social_media_url" },
    { label: "Project Status", field: "project_status" },
    { label: "Needs", field: "needs" },
    { label: "Sector", field: "sector" },
    { label: "Maturity", field: "maturity" },
    { label: "Views", field: "views" },
    { label: "Description", field: "description" },
    { label: "Legal Status", field: "legal_status" },
    { label: "Image URL", field: "image" },
  ];

  return (
    <Card variant="outlined" sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Startup Information
      </Typography>

      {fields.map(({ label, field }) => (
        <div key={field} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {editingField === field ? (
            <>
              <TextField
                label={label}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                fullWidth
              />
              <IconButton color="success" onClick={handleSave}>
                <SaveIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography sx={{ flexGrow: 1 }}>
                <strong>{label}:</strong> {startup[field]}
              </Typography>
              <IconButton color="primary" onClick={() => handleEdit(field, startup[field])}>
                <EditIcon />
              </IconButton>
            </>
          )}
        </div>
      ))}

      <Typography>
        <strong>Created at:</strong>{" "}
        {new Date(startup.created_at).toLocaleDateString()}
      </Typography>
    </Card>
  );
}