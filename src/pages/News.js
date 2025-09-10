import Navbar from "../components/Navbar";
import { useState } from "react";
import { Container, Typography, Card, CardContent, Button, Chip, Stack } from "@mui/material";

export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_APP_API_URL}/news`);
    if (!res.ok) {
      throw new Error("Erreur lors de la récupération des news");
    }
    const news = await res.json();

    news.sort((a, b) => new Date(b.news_date) - new Date(a.news_date));

    return { props: { news } };
  } catch (error) {
    console.error(error);
    return { props: { news: [] } };
  }
}

export default function News({ news }) {
  const [filter, setFilter] = useState("all");

  const categories = ["all", "Funding", "Award", "Launch", "Partnership"];

  const filteredNews =
    filter === "all" ? news : news.filter((item) => item.category === filter);

  const categoryColors = {
    Funding: "success",
    Award: "primary",
    Launch: "warning",
    Partnership: "info",
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Fil d'actualité
        </Typography>

        <Stack direction="row" spacing={1} mb={3}>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "contained" : "outlined"}
              onClick={() => setFilter(cat)}
            >
              {cat.toUpperCase()}
            </Button>
          ))}
        </Stack>

        <Stack spacing={3}>
          {filteredNews.map((item) => (
            <Card key={item.id} variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography color="text.secondary">
                    {new Date(item.news_date).toLocaleDateString()} - {item.location}
                  </Typography>
                  <Chip
                    label={item.category.toUpperCase()}
                    color={categoryColors[item.category] || "default"}
                    size="small"
                  />
                </Stack>
                <Typography variant="h6">{item.title}</Typography>
              </CardContent>
            </Card>
          ))}

          {filteredNews.length === 0 && (
            <Typography variant="body1" color="text.secondary">
              Aucune news pour cette catégorie.
            </Typography>
          )}
        </Stack>
      </Container>
    </>
  );
}
