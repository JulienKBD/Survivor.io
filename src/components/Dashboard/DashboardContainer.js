import { Grid, Box } from "@mui/material";
import Sales from "./todays-sales/Sales";
import PieChartComponent from "./PieChartComponent";

const Dashboard = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'flex-start',
      gap: 0,
      width: '100%'
    }}>
      <Box sx={{
        width: { xs: '100%', md: '58%' },
        flexShrink: 0
      }}>
        <Sales />
      </Box>
      <Box sx={{
        width: { xs: '100%', md: '42%' },
        flexShrink: 0,
        mt: { xs: 2, md: 4 },
        ml: { md: 1 }
      }}>
        <PieChartComponent />
      </Box>
    </Box>
  );
};

export default Dashboard;