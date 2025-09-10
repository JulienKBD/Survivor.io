import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded?.role) {
          setRole(decoded.role);
        }
      } catch (err) {
        console.error("Erreur décodage JWT:", err);
      }
    }
  }, []);

  const handleClickUser = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickMobile = (event) => {
    setMobileAnchorEl(mobileAnchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    handleClose();
    router.push("/Login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/Projects" },
    { name: "News", href: "/News" },
    { name: "Events", href: "/Events" },
  ];

  return (
    <Box
      component="header"
      sx={{
        py: 2,
        px: 4,
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "sticky",
        top: 0,
        backgroundColor: "background.body",
        zIndex: 10,
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box
            component="img"
            sx={{ height: 84, width: 84 }}
            alt="JEB INCUBATOR LOGO"
            src="https://jeb-incubator.com/images/logo.png"
          />
        </Link>

        {/* Navigation pour desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 5 }}>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} style={{ textDecoration: "none" }}>
              <Typography
                level="body-md"
                sx={{
                  fontSize: "23px",
                  color: "text.primary",
                  "&:hover": { color: "primary.plainColor" },
                }}
              >
                {link.name}
              </Typography>
            </Link>
          ))}
        </Box>

        {/* Menu utilisateur ou Login */}
        {isLoggedIn ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Desktop Account Menu */}
            <Button
              variant="outlined"
              color="neutral"
              sx={{
                fontSize: "21px",
                minHeight: "82px",
                minWidth: "120px",
                padding: "12px",
                display: { xs: "none", md: "inline-flex" },
              }}
              onClick={handleClickUser}
            >
              <AccountCircleIcon sx={{ fontSize: "40px" }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              placement="bottom-end"
            >
              <MenuItem onClick={handleClose}>
                <Link
                  href="/DashboardProfile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Dashboard
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link
                  href="/Messages"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Messages
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link
                  href="/Profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Profile
                </Link>
              </MenuItem>

              {role === "admin" && (
                <MenuItem onClick={handleClose}>
                  <Link
                    href="/AdminPanel"
                    style={{ textDecoration: "none", color: "red", fontWeight: "bold" }}
                  >
                    Admin Panel
                  </Link>
                </MenuItem>
              )}

              <MenuItem onClick={handleLogout}>
                <LogoutIcon style={{ marginRight: 8, color: "red" }} />
                Logout
              </MenuItem>
            </Menu>

            {/* Mobile burger */}
            <Button
              variant="outlined"
              color="neutral"
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              onClick={handleClickMobile}
            >
              <MenuIcon />
            </Button>
            <Menu
              anchorEl={mobileAnchorEl}
              open={Boolean(mobileAnchorEl)}
              onClose={handleClose}
              placement="bottom-end"
            >
              {navLinks.map((link) => (
                <MenuItem key={link.name} onClick={handleClose}>
                  <Link
                    href={link.href}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {link.name}
                  </Link>
                </MenuItem>
              ))}
              <MenuItem onClick={handleClose}>
                <Link
                  href="/DashboardProfile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Dashboard
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link
                  href="/Profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Profile
                </Link>
              </MenuItem>

              {role === "admin" && (
                <MenuItem onClick={handleClose}>
                  <Link
                    href="/AdminPanel"
                    style={{ textDecoration: "none", color: "red", fontWeight: "bold" }}
                  >
                    Admin Panel
                  </Link>
                </MenuItem>
              )}

              <MenuItem onClick={handleLogout}>
                <LogoutIcon style={{ marginRight: 8, color: "red" }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Link href="/Login" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              color="neutral"
              sx={{
                fontSize: "21px",
                padding: "10px 24px",
                minHeight: "82px",
                minWidth: "120px",
                fontWeight: "bold",
                transform: "translateY(-3px)",
              }}
            >
              Login
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
}
