import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Pie } from "@ant-design/plots";

const PieChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const startupRes = await fetch(`${process.env.REACT_APP_API_URL}/startups`);
        const startups = await startupRes.json();
        const startupsArray = Array.isArray(startups) ? startups : startups?.data || [];

        // Comptage par secteur
        const sectorCounts = {};
        startupsArray.forEach((startup) => {
          if (startup.sector) {
            sectorCounts[startup.sector] = (sectorCounts[startup.sector] || 0) + 1;
          }
        });

        const chartData = Object.keys(sectorCounts).map((key) => ({
          type: key,
          value: sectorCounts[key],
        }));

        setData(chartData);
      } catch (err) {
        console.error("Erreur fetch sector data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSectorData();
  }, []);

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      content: (item) => `${item.type}: ${item.value}`,
    },
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
        height: 580,
        width: "100%",
        maxWidth: 500,
        marginLeft: { md: "20px" },
      }}
    >
      <Typography variant="h6" mb={2}>
        Startups by Sector
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : data.length > 0 ? (
        <Pie {...config} />
      ) : (
        <Typography>No sector data available</Typography>
      )}
    </Box>
  );
};

export default PieChartComponent;
