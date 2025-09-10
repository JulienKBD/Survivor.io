import { Card, CardContent, Stack, Typography } from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';

const iconColors = ["#2a282d", "#2a282d", "#2a282d", "#2a282d"];
const cardColors = ["#106acb", "#6f87a5", "#3072ac", "#eff3f7"];
const icons = [BarChartIcon, ShowChartIcon, TrendingUpIcon, PieChartIcon];

const SaleCard = ({ item, index, sx }) => {
  const { value, label } = item;
  const iconColor = iconColors[index % iconColors.length];
  const cardColor = cardColors[index % cardColors.length];
  const IconComponent = icons[index % icons.length];

  return (
    <Card
      sx={{
        borderRadius: 4,
        bgcolor: cardColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...sx,
      }}
    >
      <Stack
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: iconColor,
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconComponent sx={{ color: "#fff" }} />
      </Stack>
      <Typography variant="h4" color="primary.darker" mb={1}>
        {value}
      </Typography>
      <Typography variant="subtitle1" color="grey.800" textAlign="center">
        {label}
      </Typography>
    </Card>
  );
};

export default SaleCard;