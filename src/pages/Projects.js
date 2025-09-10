import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import ProjectCard from "../components/Projects/ProjectCard";
import Button from "@mui/joy/Button";
import Navbar from "../components/Navbar";
import TuneIcon from "@mui/icons-material/TuneRounded";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import ProjectsFilter from "../components/Projects/ProjectsFilter";
import TextField from "@mui/joy/Input";

export default function ProjectsPage() {
  const router = useRouter();

  const { search: querySearch = "",
    date = "Default",
    age = "Default",
    sector = "All",
    location = "All"
} = router.query;

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState(querySearch);
  const [dateFilter, setDateFilter] = useState(date);
  const [ageFilter, setAgeFilter] = useState(age);
  const [sectorFilter, setSectorFilter] = useState(sector);
  const [locationFilter, setLocationFilter] = useState(location);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const projectsList = Array.isArray(projects) ? projects : projects?.projects ?? [];

  // Filtres
  let filteredProjects = projectsList.filter((p) => {
    const locationOK = locationFilter === "All" || p.location === locationFilter;
    const sectorOK = sectorFilter === "All" || p.sector === sectorFilter;
    const searchOK = search === "" || p.title.toLowerCase().includes(search.toLowerCase());
    return locationOK && sectorOK && searchOK;
  });

  if (dateFilter === "Ascending") filteredProjects.sort((a, b) => new Date(a.published) - new Date(b.published));
  else if (dateFilter === "Descending") filteredProjects.sort((a, b) => new Date(b.published) - new Date(a.published));

  if (ageFilter === "Ascending") filteredProjects.sort((a, b) => a.age - b.age);
  else if (ageFilter === "Descending") filteredProjects.sort((a, b) => b.age - a.age);

  const handleView = useCallback(async (projectId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/views`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Error incrementing project views:", err);
    }
    router.push(`/projects/${projectId}`);
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar sx={{ mb: 3 }} />

      {/* Barre de recherche + boutons Filters / New Project */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          margin: "0 0 16px 0",
          padding: "16px",
          backgroundColor: "#f5f5f5",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search projects..."
          size="lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flexGrow: 1,
            fontSize: "18px",
            borderRadius: "12px",
            padding: "12px",
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startDecorator={<TuneIcon />}
          sx={{ minWidth: "140px" }}
        >
          Filters
        </Button>

        {isLoggedIn && (
          <Link href="/CreateProject" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="success"
              startDecorator={<AddIcon />}
              sx={{ minWidth: "140px" }}
            >
              New Project
            </Button>
          </Link>
        )}
      </div>

      {/* Filtre modal */}
      <ProjectsFilter
        open={open}
        setOpen={setOpen}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        ageFilter={ageFilter}
        setAgeFilter={setAgeFilter}
        sectorFilter={sectorFilter}
        setSectorFilter={setSectorFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />

      {/* Grille de projets */}
      <main
        style={{
          marginTop: "20px",
          gap: "42px",
          padding: "0 120px",
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        {filteredProjects.map((project) => (
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
          onView={() => handleView(project.id)}
        />
        ))}
      </main>
    </div>
  );
}
