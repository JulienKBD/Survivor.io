import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import ProjectCard from "../components/Projects/ProjectCard";
import { useRouter } from "next/router";

export default function ProjectsPreview() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRandomProjects = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/projects`);
        const data = await response.json();

        const projectsList = Array.isArray(data) ? data : data?.projects ?? [];

        const randomProjects = projectsList
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        setProjects(randomProjects);
      } catch (err) {
        console.error("Erreur lors du fetch des projets:", err);
      }
    };

    fetchRandomProjects();
  }, []);

  return (
    <Box sx={{ py: 25 }}>
      <Container>
        <Typography level="h2" sx={{ textAlign: "center", mb: 4 }}>
          Featured Projects
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {projects.map((project) => (
            <Grid key={project.id}>
              <ProjectCard
                key={project.id}
                title={project.title}
                description={{
                  published: new Date(project.published).toLocaleDateString(),
                  age: project.age,
                  sector: project.sector,
                  location: project.location,
                }}
                imageUrl={project.image}
                onView={() => router.push(`/projects/${project.id}`)}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button component={Link} href="/Projects">
            View All Projects
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
