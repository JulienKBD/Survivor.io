// pages/CreateProject.js
import { useState } from "react";
import { useRouter } from "next/router";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import FormControl from "@mui/joy/FormControl";
import Autocomplete from "@mui/joy/Autocomplete";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Navbar from "../components/Navbar";
import Textarea from "@mui/joy/Textarea";

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState(0);
  const [image, setImage] = useState("");
  const [projectStatus, setProjectStatus] = useState("Not started");
  const [loading, setLoading] = useState(false);

  const locations = [
    "All",
    "Paris",
    "Chaloupe",
    "Saint-André",
    "Tampon",
    "Madagascar",
    "Sainte-Marie",
    "Saint-Denis",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const body = {
      title,
      description,
      sector,
      location,
      age,
      project_status: projectStatus,
      views: 0,
      image,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (response.status === 201) {
        router.push("/Projects");
      } else {
        console.error("Creation project failed:", result.msg || "Unknown error");
      }
    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Navbar sx={{ m: 2, position: "sticky" }} />
      <main style={{ margin: "auto", width: "400px" }}>
        <Card variant="outlined" sx={{ p: 3, mt: 5 }}>
          <Typography level="h2" sx={{ mb: 2 }}>
            Create a New Project
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <FormControl sx={{ mb: 2 }}>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormControl>

            {/* Description */}
            <FormControl sx={{ mb: 2 }}>
              <Textarea
                placeholder="Description"
                minRows={4}
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 1042) {
                    setDescription(e.target.value);
                  }
                }}
                required
                endDecorator={
                  <Typography
                    level="body3"
                    sx={{ ml: "auto", color: "text.tertiary" }}
                  >
                    {description.length} / 1042
                  </Typography>
                }
              />
            </FormControl>

            {/* Sector */}
            <FormControl sx={{ mb: 2 }}>
              <Input
                placeholder="Sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
              />
            </FormControl>

            {/* Location */}
            <FormControl sx={{ mb: 2 }}>
              <Autocomplete
                placeholder="Location"
                options={locations}
                value={location}
                onChange={(e, newValue) => setLocation(newValue || "")}
              />
            </FormControl>

            {/* Age */}
            <FormControl sx={{ mb: 2 }}>
              <Input
                type="number"
                placeholder="Mois"
                value={age}
                onChange={(e) => setAge(Math.max(0, Number(e.target.value)))}
                required
                min={0}
              />
            </FormControl>

            {/* Image */}
            <FormControl sx={{ mb: 2 }}>
              <Input
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </FormControl>

            {/* Status */}
            <FormControl sx={{ mb: 3 }}>
              <Select
                value={projectStatus}
                onChange={(e, newValue) => setProjectStatus(newValue)}
              >
                <Option value="Not started">Not started</Option>
                <Option value="In progress">In progress</Option>
                <Option value="Done">Done</Option>
              </Select>
            </FormControl>

            {/* Submit */}
            <Button type="submit" loading={loading} variant="solid" fullWidth>
              Create Project
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
