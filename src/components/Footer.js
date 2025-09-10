import Link from "next/link";
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import Grid from '@mui/joy/Grid';

// Footer Component
export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 6, bgcolor: 'background.level2' }}>
      <Container>
        <Grid container spacing={4}>
          <Grid xs={12} sm={4}>
            <Typography level="h4" sx={{ mb: 2 }}>JEB Incubator</Typography>
            <Typography level="body-sm">
              Supporting innovation and entrepreneurship since 2025.
            </Typography>
          </Grid>
          <Grid xs={12} sm={4}>
            <Typography level="title-sm" sx={{ mb: 2 }}>Contact</Typography>
            <Typography level="body-sm">
              TEpitech, TDC 12345<br />
              Email: jeb@epitech.eu<br />
              Phone: 0692 00 00 00
            </Typography>
          </Grid>
          <Grid xs={12} sm={4}>
            <Typography level="title-sm" sx={{ mb: 2 }}>Links</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/About" style={{ textDecoration: 'none', marginBottom: '8px' }}>
                <Typography level="body-sm" sx={{ color: 'text.primary' }}>
                  About Us
                </Typography>
              </Link>
              <Link href="/Projects" style={{ textDecoration: 'none', marginBottom: '8px' }}>
                <Typography level="body-sm" sx={{ color: 'text.primary' }}>
                  Our Projects
                </Typography>
              </Link>
              <Link href="/News" style={{ textDecoration: 'none', marginBottom: '8px' }}>
                <Typography level="body-sm" sx={{ color: 'text.primary' }}>
                  News
                </Typography>
              </Link>
              <Link href="/Events" style={{ textDecoration: 'none', marginBottom: '8px' }}>
                <Typography level="body-sm" sx={{ color: 'text.primary' }}>
                  Events
                </Typography>
              </Link>
              <Link href="/Contact" style={{ textDecoration: 'none' }}>
                <Typography level="body-sm" sx={{ color: 'text.primary' }}>
                  Contact
                </Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Typography level="body-xs" sx={{ textAlign: 'center', mt: 4 }}>
          © {new Date().getFullYear()} JEB Incubator. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
