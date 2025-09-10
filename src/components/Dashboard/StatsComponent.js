import React from "react";
import { Box, Typography } from "@mui/material";
import { Pie } from "@ant-design/plots";

const StatsComponent = () => {
  const data = [
    { type: "France", value: 40 },
    { type: "Espagne", value: 30 },
    { type: "Italie", value: 20 },
    { type: "Danemark", value: 60 },
    { type: "Senegal", value: 5 },
    { type: "USA", value: 30 },
  ];

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    interactions: [{ type: "element-active" }],
  };

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        bgcolor: "rgba(226, 226, 226, 0.47)",
        borderRadius: 2,
        boxShadow: 3,
        height: 300,
        width: "100%",
        marginLeft: "0px",
        maxWidth: 500,
      }}
    >
      <Typography variant="h6" mb={2}>
        Geographical distribution of startups
      </Typography>
      <Pie {...config} />
    </Box>
  );
};

export default StatsComponent;
