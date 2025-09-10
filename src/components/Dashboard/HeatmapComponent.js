import React from "react";
import { Box, Typography } from "@mui/material";
import { Heatmap } from "@ant-design/plots";

const dataset = [
  { london: 59, paris: 57, newYork: 86, seoul: 21, month: "January" },
  { london: 50, paris: 52, newYork: 78, seoul: 28, month: "February" },
  { london: 47, paris: 53, newYork: 106, seoul: 41, month: "March" },
  { london: 54, paris: 56, newYork: 92, seoul: 73, month: "April" },
  { london: 57, paris: 69, newYork: 92, seoul: 99, month: "May" },
  { london: 60, paris: 63, newYork: 103, seoul: 144, month: "June" },
  { london: 59, paris: 60, newYork: 105, seoul: 319, month: "July" },
  { london: 65, paris: 60, newYork: 106, seoul: 249, month: "August" },
  { london: 51, paris: 51, newYork: 95, seoul: 131, month: "September" },
  { london: 60, paris: 65, newYork: 97, seoul: 55, month: "October" },
  { london: 67, paris: 64, newYork: 76, seoul: 48, month: "November" },
  { london: 61, paris: 70, newYork: 103, seoul: 25, month: "December" },
];

const data = dataset.flatMap(({ london, paris, newYork, seoul }, monthIndex) => [
  { x: "London", y: monthIndex, value: london },
  { x: "Paris", y: monthIndex, value: paris },
  { x: "New York", y: monthIndex, value: newYork },
  { x: "Seoul", y: monthIndex, value: seoul },
]);

const xData = ["London", "Paris", "New York", "Seoul"];
const yData = dataset.map(({ month }) => month);

export default function HeatmapComponent() {
  const config = {
    data,
    xField: "x",
    yField: "y",
    colorField: "value",
    xAxis: { type: "cat", data: xData },
    yAxis: { type: "cat", data: yData, width: 80 },
    height: 248,
    width: 850,
    color: ["#0478c0ff", "#08519c"],
    tooltip: { showTitle: false },
    interactions: [{ type: "element-active" }],
  };

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        bgcolor: "rgba(226, 226, 226, 0.47)",
        borderRadius: 2,
        width: "100%",
        height: "auto",
        boxShadow: 3,
        maxWidth: 780,
      }}
    >
      <Typography variant="h6" mb={2}>
        Heatmap Example
      </Typography>
      <Heatmap {...config} />
    </Box>
  );
}
