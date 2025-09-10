import * as React from "react";
import Navbar from "../components/Navbar";
import Button from "@mui/joy/Button";
import {
  Box,
  CssBaseline,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import StartupInfos from "../components/Profile/StartupInfos";
import UserInfos from "../components/Profile/UserInfos";

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

export default function Profile() {
  const [user, setUser] = React.useState(null);
  const [globalError, setGlobalError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [token, setToken] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  React.useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decoded = parseJwt(storedToken);
      if (decoded?.id) setUserId(decoded.id);
    }
  }, []);

  React.useEffect(() => {
    if (!token || !userId) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setGlobalError("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setGlobalError("An error occurred while fetching user info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token || !userId) return;

    const data = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(data.entries());

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully");
        setGlobalError("");
        setUser((prev) => ({ ...prev, ...jsonData }));
      } else {
        setSuccess("");
        setGlobalError(result.msg || "Update failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setGlobalError("An error occurred. Please try again later.");
    }
  };

  if (loading)
    return<p>Loading...</p>;
  if (!user)
    return <p>No user data found.</p>;

  return (
    <main>
      <CssBaseline />
      <Navbar />

      <UserInfos user={user} />

      <StartupInfos user={user} token={token} setGlobalError={setGlobalError} setLoading={setLoading} />

      <Card variant="outlined" sx={{ mt: 6 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", textAlign: "center", mb: 2 }}
        >
          Profile Settings
        </Typography>

        {globalError && (
          <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
            {globalError}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{ textAlign: "center", mb: 2 }}>
            {success}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {["name", "email", "password"].map((field) => (
            <FormControl key={field}>
              <FormLabel htmlFor={field}>{field}</FormLabel>
              <TextField
                id={field}
                name={field}
                defaultValue={field !== "password" ? user[field] : ""}
                placeholder={field === "password" ? "••••••" : ""}
                type={field === "password" ? "password" : "text"}
                fullWidth
              />
            </FormControl>
          ))}
          <Button type="submit" fullWidth variant="solid" color="primary">
            Save Changes
          </Button>
        </Box>
      </Card>
    </main>
  );
}