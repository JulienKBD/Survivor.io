import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";

export default function NewsCard({ title, date, description, imageUrl }) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <AspectRatio ratio="16/9">
        <img
          src={imageUrl}
          loading="lazy"
          alt={title}
          style={{ objectFit: "cover" }}
        />
      </AspectRatio>

      {/* Contenu */}
      <CardContent>
        <Typography level="title-md" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography level="body-xs" sx={{ color: "text.secondary", mb: 1 }}>
          {date}
        </Typography>
        <Typography level="body-sm" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Button variant="soft" size="sm" sx={{ mt: "auto" }}>
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}
