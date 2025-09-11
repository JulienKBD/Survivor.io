import * as React from "react";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import {
  Typography,
  TextField,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
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

export default function UserInfos({ user, token, setGlobalError }) {
  const [userData, setUserData] = React.useState(user);
  const [editingField, setEditingField] = React.useState(null);
  const [tempValue, setTempValue] = React.useState("");

  const [editingPassword, setEditingPassword] = React.useState(false);
  const [passwordFields, setPasswordFields] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEdit = (field) => {
    setEditingField(field);
    setTempValue(userData[field] || "");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
    setGlobalError("");
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [editingField]: tempValue }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUserData((prev) => ({ ...prev, [editingField]: tempValue }));
        setEditingField(null);
        setGlobalError("");
      } else {
        setGlobalError(result.error || "Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Erreur lors de la mise à jour.");
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordFields;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setGlobalError("Tous les champs du mot de passe sont requis.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setGlobalError("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.id}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setEditingPassword(false);
        setGlobalError("");
      } else {
        setGlobalError(result.error || "Erreur lors de la mise à jour du mot de passe.");
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Erreur lors de la mise à jour du mot de passe.");
    }
  };

  if (!userData) return null;

  const fields = [
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Role", field: "role" },
  ];

  return (
    <Card variant="outlined" sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        User Information
      </Typography>

      {fields.map(({ label, field }) => (
        <div key={field} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {editingField === field && field !== "role" ? (
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
                <strong>{label}:</strong> {userData[field]}
              </Typography>
              {field !== "role" && (
                <IconButton color="primary" onClick={() => handleEdit(field)}>
                  <EditIcon />
                </IconButton>
              )}
            </>
          )}
        </div>
      ))}

      {/* --- Mot de passe --- */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Password
      </Typography>

      {editingPassword ? (
        <>
          <TextField
            label="Current Password"
            type="password"
            value={passwordFields.currentPassword}
            onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="New Password"
            type="password"
            value={passwordFields.newPassword}
            onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Confirm new Password"
            type="password"
            value={passwordFields.confirmPassword}
            onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSavePassword}>
              Save
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => setEditingPassword(false)}>
              Cancel
            </Button>
          </Stack>
        </>
      ) : (
        <Button sx={{ mt: 1 }} variant="contained" color="primary" onClick={() => setEditingPassword(true)}>
          Update Password
        </Button>
      )}
    </Card>
  );
}