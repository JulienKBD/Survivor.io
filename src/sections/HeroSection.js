import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <Box
      sx={{
        py: { xs: 12, md: 10 },
        textAlign: 'center',
        bgcolor: 'background.level1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
      }}
    >
      <Container>
        <Typography
          level="h1"
          sx={{
            mb: 2,
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 'bold',
          }}
        >
          Welcome to JEB Incubator
        </Typography>

        <Typography
          level="body-lg"
          sx={{
            maxWidth: '800px',
            mx: 'auto',
            mb: 4,
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'text.secondary',
          }}
        >
          We are a premier startup incubator dedicated to fostering innovation and supporting entrepreneurs
          in bringing their visions to life. Our platform connects startups with investors, partners, and
          resources needed for success.
        </Typography>

        <Link href="https://jeb-incubator.com/" style={{ textDecoration: 'none' }}>
          <Button
            size="lg"
            variant="solid"
            color="primary"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              },
            }}
          >
            Learn More
          </Button>
        </Link>
      </Container>
    </Box>
  );
}
