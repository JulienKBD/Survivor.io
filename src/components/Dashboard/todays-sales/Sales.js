import { Box, Grid, Paper, Stack, Typography, Button } from "@mui/material";
import SaleCard from "./SaleCard";
import OrderIcon from "../../../components/icons/OrderIcon";
import SalesIcon from "../../../components/icons/SalesIcon";
import { useEffect, useState } from "react";

const Sales = () => {
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const userRes = await fetch(`${process.env.REACT_APP_API_URL}/user`);
        const userData = await userRes.json();
        const founderId = userData.founder_id;

        const startupRes = await fetch(`${process.env.REACT_APP_API_URL}/startups/${founderId}`);
        const startupData = await startupRes.json();

        setStartup(startupData);
      } catch (err) {
        console.error("Erreur fetch startup:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, []);

  const sales = startup ? [
    { label: 'Number of startups', value: startup.numberOfStartups || 0, svgIcon: SalesIcon },
    { label: 'Project views', value: startup.views || 0, svgIcon: OrderIcon },
    { label: 'Commitment', value: startup.committed || 0 },
    { label: 'Amounts raised by startup', value: startup.amountRaised || 0 },
  ] : [];

  return (
    <Box sx={{
      position: "relative",
      left: { xs: "5%", sm: "5%", md: 80 },
      width: { xs: "90%", sm: "90%", md: "86%" },
      zIndex: 1,
      p: { xs: 1, sm: 2 },
      mt: { xs: 3, sm: 5, md: 6 },
      minHeight: { xs: 600, sm: 700, md: 400 }
    }}>
      <Paper sx={{
        pt: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 4 },
        bgcolor: "rgba(226, 226, 226, 0.47)",
        minHeight: { xs: 600, sm: 700, md: 400 },
        boxShadow: 3,
        borderRadius: 2
      }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={{ xs: 3, sm: 5 }}
          spacing={{ xs: 1, sm: 0 }}
        >
          <div>
            <Typography variant="h5" sx={{ fontSize: { xs: 18, sm: 22, md: 28 }, color: "black" }} mb={0.5}>
              Key statistics
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: { xs: 12, sm: 14, md: 16 }, color: "black" }}>
              Dashboard
            </Typography>
          </div>
          <Button variant="outlined" sx={{ mt: { xs: 1, sm: 0 }, fontSize: { xs: 12, sm: 14 }, color: "black", borderColor: "black" }}>
            Export
          </Button>
        </Stack>

        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100%' }}
        >
          {loading ? (
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography>Loading...</Typography>
            </Grid>
          ) : (
            sales.map((item, index) => (
              <Grid
                item
                key={item.label}
                xs={6}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: index < 3 ? 2 : 0
                }}
              >
                <SaleCard
                  item={item}
                  index={index}
                  sx={{ width: { xs: 140, sm: 160, md: 210 }, height: { xs: 140, sm: 160, md: 210 } }}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Sales;