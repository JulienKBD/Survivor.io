import { Box, Typography } from "@mui/material";
import { Bar } from '@ant-design/plots';

const Barre = () => {
  const barData = [
    { type: 'France', series1: 1, series2: 1, series3: 2 },
    { type: 'Espagne', series1: 1, series2: 6, series3: 5 },
    { type: 'Italie', series1: 5, series2: 3, series3: 6 },
  ];

  const config = {
    data: barData,
    xField: 'type',
    yField: 'series1',
    seriesField: 'type',
    height: 296,
    appendPadding: 20,
    color: ['#4D96FF', '#6BCB77', '#FFD93D'],
  };

  return (
    <Box sx={{ mt: 8, ml: 4, p: 3, bgcolor: "rgba(226, 226, 226, 0.47)", borderRadius: 2, width: 750, boxShadow: 3 }}>
      <Typography variant="h6" mb={2}>
        Geographical distribution of startups
      </Typography>
      <Bar {...config} />
    </Box>
  );
};

export default Barre;
