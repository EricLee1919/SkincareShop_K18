import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import convertCurrency from "../../utils/currency";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const ReportPage = () => {
  const [summary, setSummary] = useState({
    totalAccount: 0,
    totalOrder: 0,
    totalProduct: 0,
    totalRevenue: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Fetch dashboard summary
    fetch("http://localhost:8080/api/dashboard", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
      });

    // Fetch chart data
    fetch("http://localhost:8080/api/dashboard/chart", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const labels = data.labels;
        const revenueData = labels.map((label) => data.data[label]);

        setChartData({
          labels,
          datasets: [
            {
              label: "Revenue",
              data: revenueData,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.3,
              fill: true,
            },
          ],
        });
      });
  }, []);

  const statCards = [
    { label: "Total Accounts", value: summary.totalAccount },
    { label: "Total Orders", value: summary.totalOrder },
    { label: "Total Products", value: summary.totalProduct },
    { label: "Total Revenue", value: `${convertCurrency(summary.totalRevenue)}` },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Report
      </Typography>

      <Grid container spacing={3} mb={5}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ minHeight: 100 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h6">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Monthly Revenue
          </Typography>
          <Line data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;
