import * as React from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {  CssBaseline } from "@mui/material";
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
  const router = useRouter();
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

  if (loading)
    return<p>Loading...</p>;
  if (!user)
    return <p>No user data found.</p>;

  return (
    <main>
      <CssBaseline />
      <Navbar />

      <UserInfos user={user} token={token} setGlobalError={setGlobalError} />

      <StartupInfos user={user} token={token} setGlobalError={setGlobalError} setLoading={setLoading} />
    </main>
  );
}
