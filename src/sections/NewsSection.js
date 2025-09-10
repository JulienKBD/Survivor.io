import Link from "next/link";
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import { useEffect, useState } from "react";


function NewsCard({ title, date, excerpt, category, location }) {
  const categoryColors = {
    Funding: 'success',
    Award: 'primary',
    Launch: 'warning',
    Partnership: 'info',
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: { xs: '200px', md: '400px' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography level="body-xs">
            {new Date(date).toLocaleDateString()} — {location}
          </Typography>
          <Chip
            size="sm"
            color={categoryColors[category] || 'neutral'}
            variant="soft"
          >
            {category?.toUpperCase()}
          </Chip>
        </Box>
        <Typography level="title-sm">{title}</Typography>
        {excerpt && (
          <Typography level="body-sm" sx={{ mt: 1 }}>
            {excerpt}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.RENDER_URL}/news`)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => new Date(b.news_date) - new Date(a.news_date));
        setNews(data.slice(0, 3));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ py: 20, bgcolor: "background.level1" }}>
      <Container>
        <Typography level="h2" sx={{ textAlign: "center", mb: 4 }}>
          Latest News
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {loading ? (
            <Typography>Chargement...</Typography>
          ) : news.length > 0 ? (
            news.map((item) => (
              <Grid key={item.id}>
                <NewsCard
                  title={item.title}
                  date={item.news_date}
                  excerpt={item.description}
                  category={item.category}
                  location={item.location} 
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              Aucune news disponible.
            </Typography>
          )}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button component={Link} href="/News">
            View All News
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
