import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import dynamic from 'next/dynamic';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

function DashboardChart({ title, value, gradient, data }) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const trendColor = data.length > 0 && data[data.length - 1] >= data[0] ? '#106ACB' : '#6F87A5';

  const sparkOptions = {
    chart: { id: 'spark', type: 'line', height: 60, sparkline: { enabled: true }, dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.2 } },
    series: [{ data }],
    stroke: { curve: 'smooth', width: 2, colors: [trendColor] },
    markers: { size: 0 },
    grid: { padding: { top: 15, bottom: 5 } },
    colors: [trendColor],
    tooltip: { x: { show: false }, y: { title: { formatter: () => '' } } }
  };

  return (
    <Box sx={{ background: gradient, p: 2.5, borderRadius: 2, boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)", color: "black", width: { xs: "200px", md: "400px" }, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Box sx={{ textAlign: "left", mb: 0.5 }}>
        <Typography level="h4" sx={{ fontWeight: "400", opacity: 0.9 }}>{title}</Typography>
        <Typography level="h3" sx={{ mt: 1, fontSize: "20px", fontWeight: "bold" }}>{value}</Typography>
      </Box>
      {isClient && <ApexCharts options={sparkOptions} series={sparkOptions.series} type="line" height={60} />}
    </Box>
  );
}

export default function DashboardSection() {
  const [startupCount, setStartupCount] = React.useState(0);
  const [totalProjectViews, setTotalProjectViews] = React.useState(0);
  const [committedRate, setCommittedRate] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [startupIds, setStartupIds] = React.useState([]);
  const [viewsData, setViewsData] = React.useState([]);
  const [committedData, setCommittedData] = React.useState([]);
  const [startupCountData, setStartupCountData] = React.useState([]);
  const [projectViewsData, setProjectViewsData] = React.useState([]);

  // Fetch startups
  React.useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups`);
        const startups = await res.json();
        const startupArray = Array.isArray(startups) ? startups : startups?.data || [];
        setStartupCount(startupArray.length);
        setStartupIds(startupArray.map(s => s.id));
        setStartupCountData(startupArray.map((_, i) => i + 1));
      } catch (err) {
        console.error(err);
      }
    };
    fetchStartups();
  }, []);

  // Fetch startup metrics (views + committed)
  React.useEffect(() => {
    if (startupIds.length === 0) return;

    const fetchMetrics = async () => {
      try {
        const promises = startupIds.map(id =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/${id}`).then(res => res.json())
        );
        const results = await Promise.all(promises);

        const views = results.reduce((sum, r) => sum + (r.views || 0), 0);
        const committed = results.reduce((sum, r) => sum + (r.committed || 0), 0);
        const rate = views > 0 ? Math.round((committed / views) * 100) : 0;

        setCommittedRate(rate);
        setViewsData(results.map(r => r.views || 0));
        setCommittedData(results.map(r => r.committed || 0));
      } catch (err) {
        console.error(err);
      }
    };

    fetchMetrics();
  }, [startupIds]);

  // Fetch project views
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
        const projects = await res.json();
        const projectsArray = Array.isArray(projects) ? projects : projects?.data || [];

        const totalViews = projectsArray.reduce((sum, p) => sum + (p.views || 0), 0);
        setTotalProjectViews(totalViews);

        setProjectViewsData(projectsArray.map(p => p.views || 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const sparklineData = [
    { title: 'Number of startups', value: loading ? "..." : `${startupCount}`, gradient: 'linear-gradient(135deg, #e0e0e0 10%, #e0e0e0 100%)', data: startupCountData },
    { title: 'Total project views', value: loading ? "..." : `${totalProjectViews}`, gradient: 'linear-gradient(135deg, #e0e0e0 10%, #e0e0e0 100%)', data: projectViewsData },
    { title: 'Committed rate', value: loading ? "..." : `${committedRate}%`, gradient: 'linear-gradient(135deg, #e0e0e0 10%, #e0e0e0 100%)', data: committedData }
  ];

  return (
    <Box sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 40 }}>
      <Typography level="h2" sx={{ mb: 4, textAlign: 'center' }}>Dashboard</Typography>
      <Grid container spacing={10} sx={{ justifyContent: 'center' }}>
        {sparklineData.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <DashboardChart title={item.title} value={item.value} gradient={item.gradient} data={item.data} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
