// components/SearchFilter.jsx
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import FormControl from "@mui/joy/FormControl";
import RadioGroup from "@mui/joy/RadioGroup";
import Radio from "@mui/joy/Radio";
import Typography from "@mui/joy/Typography";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EuroIcon from "@mui/icons-material/Euro";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import HouseIcon from "@mui/icons-material/House";
import ShopIcon from "@mui/icons-material/Shop";

export default function SearchFilter({
  open,
  setOpen,
  dateFilter,
  setDateFilter,
  ageFilter,
  setAgeFilter,
  sectorFilter,
  setSectorFilter,
  locationFilter,
  setLocationFilter,
}) {
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: 420, p: 2 }}>
        <Typography sx={{ fontSize: "30px", fontWeight: "lg" }}>
          Filtres
        </Typography>

        {/* Date */}
        <FormControl sx={{ mt: 3 }}>
          <Typography level="title-md" sx={{ mb: 1 }}>
            Published
          </Typography>
          <RadioGroup
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 1.5,
              }}
            >
              {[
                { name: "Default", icon: <MoreHorizIcon /> },
                { name: "Ascending", icon: <ArrowUpwardIcon /> },
                { name: "Descending", icon: <ArrowDownwardIcon /> },
              ].map((item) => (
                <Card
                  key={item.name}
                  sx={{
                    boxShadow: "none",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "background.level1" },
                    ...(dateFilter === item.name && {
                      bgcolor: "rgba(0, 0, 255, 0.14)",
                    }),
                  }}
                >
                  <CardContent>
                    {item.icon}
                    <Typography level="title-md">{item.name}</Typography>
                  </CardContent>
                  <Radio
                    disableIcon
                    overlay
                    checked={dateFilter === item.name}
                    variant="outlined"
                    color="neutral"
                    value={item.name}
                    sx={{ mt: -2 }}
                    slotProps={{
                      action: {
                        sx: {
                          ...(dateFilter === item.name && {
                            borderWidth: 2,
                            borderColor:
                              "var(--joy-palette-primary-outlinedBorder)",
                          }),
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 255, 0.14)",
                          },
                        },
                      },
                    }}
                  />
                </Card>
              ))}
            </Box>
          </RadioGroup>
        </FormControl>

        {/* Age Filter */}
        <FormControl sx={{ mt: 3 }}>
          <Typography level="title-md" sx={{ mb: 1 }}>
            Age
          </Typography>
          <RadioGroup
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 1.5,
              }}
            >
              {[
                { name: "Default", icon: <MoreHorizIcon /> },
                { name: "Ascending", icon: <ArrowUpwardIcon /> },
                { name: "Descending", icon: <ArrowDownwardIcon /> },
              ].map((item) => (
                <Card
                  key={item.name}
                  sx={{
                    boxShadow: "none",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "background.level1" },
                    ...(ageFilter === item.name && {
                      bgcolor: "rgba(0, 0, 255, 0.14)",
                    }),
                  }}
                >
                  <CardContent>
                    {item.icon}
                    <Typography level="title-md">{item.name}</Typography>
                  </CardContent>
                  <Radio
                    disableIcon
                    overlay
                    checked={ageFilter === item.name}
                    variant="outlined"
                    color="neutral"
                    value={item.name}
                    sx={{ mt: -2 }}
                    slotProps={{
                      action: {
                        sx: {
                          ...(ageFilter === item.name && {
                            borderWidth: 2,
                            borderColor:
                              "var(--joy-palette-primary-outlinedBorder)",
                          }),
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 255, 0.14)",
                          },
                        },
                      },
                    }}
                  />
                </Card>
              ))}
            </Box>
          </RadioGroup>
        </FormControl>

        {/* Sector Filter */}
        <FormControl sx={{ mt: 4 }}>
          <Typography level="title-md" sx={{ mb: 1 }}>
            Sector
          </Typography>
          <RadioGroup
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 1.5,
              }}
            >
              {[
                { name: "All", icon: <MoreHorizIcon /> },
                { name: "Finance", icon: <EuroIcon /> },
                { name: "Video Games", icon: <VideogameAssetIcon /> },
                { name: "Restauration", icon: <RestaurantIcon /> },
                { name: "AI", icon: <SmartToyIcon /> },
                { name: "Architecture", icon: <HouseIcon /> },
                { name: "E-commerce", icon: <ShopIcon /> },
              ].map((sector) => (
                <Card
                  key={sector.name}
                  sx={{
                    boxShadow: "none",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "background.level1" },
                    ...(sectorFilter === sector.name && {
                      bgcolor: "rgba(0, 0, 255, 0.14)",
                    }),
                  }}
                >
                  <CardContent>
                    {sector.icon}
                    <Typography level="title-md">{sector.name}</Typography>
                  </CardContent>
                  <Radio
                    disableIcon
                    overlay
                    checked={sectorFilter === sector.name}
                    variant="outlined"
                    color="neutral"
                    value={sector.name}
                    sx={{ mt: -2 }}
                    slotProps={{
                      action: {
                        sx: {
                          ...(sectorFilter === sector.name && {
                            borderWidth: 2,
                            borderColor:
                              "var(--joy-palette-primary-outlinedBorder)",
                          }),
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 255, 0.14)",
                          },
                        },
                      },
                    }}
                  />
                </Card>
              ))}
            </Box>
          </RadioGroup>
        </FormControl>

        {/* Location Filter */}
        <FormControl sx={{ mt: 4 }}>
          <Typography level="title-md" sx={{ mb: 1 }}>
            Location
          </Typography>
          <RadioGroup
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 1.5,
              }}
            >
              {[
                "All",
                "Paris",
                "Chaloupe",
                "Saint-André",
                "Tampon",
                "Madagascar",
                "Sainte-Marie",
                "Saint-Denis",
              ].map((location) => (
                <Card
                  key={location}
                  sx={{
                    boxShadow: "none",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "background.level1" },
                    ...(locationFilter === location && {
                      bgcolor: "rgba(0, 0, 255, 0.14)",
                    }),
                  }}
                >
                  <CardContent>
                    <Typography level="title-md">{location}</Typography>
                  </CardContent>
                  <Radio
                    disableIcon
                    overlay
                    checked={locationFilter === location}
                    variant="outlined"
                    color="neutral"
                    value={location}
                    sx={{ mt: -2 }}
                    slotProps={{
                      action: {
                        sx: {
                          ...(locationFilter === location && {
                            borderWidth: 2,
                            borderColor:
                              "var(--joy-palette-primary-outlinedBorder)",
                          }),
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 255, 0.14)",
                          },
                        },
                      },
                    }}
                  />
                </Card>
              ))}
            </Box>
          </RadioGroup>
        </FormControl>
      </Box>
    </Drawer>
  );
}
