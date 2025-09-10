import { useState } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";

export default function ProjectCard({ title, description, imageUrl, onView }) {
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg)"
  );

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left; // position relative à la carte
    const y = e.clientY - card.top;

    const centerX = card.width / 2;
    const centerY = card.height / 2;

    // Angle max
    const rotateX = ((y - centerY) / centerY) * 10; // inclinaison verticale
    const rotateY = ((x - centerX) / centerX) * 10; // inclinaison horizontale

    setTransform(
      `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    );
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  };

  return (
    <Card
      onClick={() => onView?.()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: { xs: 200, md: 300 },
        mx: "auto",
        cursor: "pointer",
        borderRadius: "16px",
        backgroundColor: "rgba(16, 106, 203, 0.2)",
        overflow: "hidden",
        transform,
        transition: "transform 0.2s ease, box-shadow 0.3s ease",
        boxShadow: "0 10px 20px rgba(16, 106, 203, 0.2)",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      <Typography
        level="title-lg"
        sx={{
          p: 1.5,
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
        }}
      >
        {title}
      </Typography>

      <AspectRatio minHeight="140px" maxHeight="220px">
        <img
          src={imageUrl}
          srcSet={`${imageUrl}&dpr=2 2x`}
          loading="lazy"
          alt={title}
          style={{ objectFit: "cover" }}
        />
      </AspectRatio>

      <CardContent
        orientation="vertical"
        sx={{
          p: 2,
          background: "rgba(0,0,0,0.05)",
          color: "#fff",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <Typography level="body-sm">Published: {description.published}</Typography>
        <Typography level="body-sm">Age: {description.age} years</Typography>
        <Typography level="body-sm">Sector: {description.sector}</Typography>
        <Typography level="body-sm">Location: {description.location}</Typography>
      </CardContent>
    </Card>
  );
}
