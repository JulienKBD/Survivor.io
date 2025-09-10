import * as React from "react";
import { Typography } from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";

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

  const fetchStartup = async (startupId) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/${startupId}`, {
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

  if (!startup || user.role !== "founder") return null;

  return (
    <Card variant="outlined" sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Startup Information
        </Typography>
        <Typography><strong>Name:</strong> {startup.name}</Typography>
        <Typography><strong>Email:</strong> {startup.email}</Typography>
        <Typography><strong>Phone:</strong> {startup.phone}</Typography>
        <Typography><strong>Address:</strong> {startup.address}</Typography>
        <Typography><strong>Website:</strong> {startup.website_url}</Typography>
        <Typography><strong>Social Media:</strong> {startup.social_media_url}</Typography>
        <Typography><strong>Project Status:</strong> {startup.project_status}</Typography>
        <Typography><strong>Needs:</strong> {startup.needs}</Typography>
        <Typography><strong>Sector:</strong> {startup.sector}</Typography>
        <Typography><strong>Maturity:</strong> {startup.maturity}</Typography>
        <Typography><strong>Views:</strong> {startup.views}</Typography>
        <Typography><strong>Description:</strong> {startup.description}</Typography>
        <Typography><strong>Legal status:</strong> {startup.legal_status}</Typography>
        <Typography><strong>Created at:</strong> {new Date(startup.created_at).toLocaleDateString()}</Typography>
        <Typography><strong>Image URL:</strong> {startup.image}</Typography>
    </Card>
    );
}