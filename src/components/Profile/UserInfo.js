import * as React from "react";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

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

export default function UserInfos({ user }) {
  if (!user) return null;

  return (
    <Card variant="outlined" sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        User Information
      </Typography>
      <Typography><strong>Name:</strong> {user.name}</Typography>
      <Typography><strong>Email:</strong> {user.email}</Typography>
      <Typography><strong>Role:</strong> {user.role}</Typography>
    </Card>
  );
}
