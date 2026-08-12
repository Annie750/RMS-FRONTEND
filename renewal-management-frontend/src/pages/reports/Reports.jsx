import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import axiosInstance from "../../api/axiosInstance";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip
} from 'recharts';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import { RENEWAL_STATUS } from '../../utils/constants';

import dashboardService from "../../services/dashboardService";

const Reports = () => {
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [summary, setSummary] = useState(null);
const [monthlyRenewals, setMonthlyRenewals] = useState([]);
const [revenueTrend, setRevenueTrend] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const loadReports = async () => {
    try {
      const [summaryData, monthlyData, revenueData] =
        await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getMonthlyRenewals(),
          dashboardService.getRevenueTrend(),
        ]);

      setSummary(summaryData);
      setMonthlyRenewals(monthlyData);
      setRevenueTrend(revenueData);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  loadReports();
}, []);
  const handleExportPDF = async () => {
  try {
    const response = await axiosInstance.get(
      "/reports/export/pdf",
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      "renewals-report.pdf"
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (err) {
    toast.error("Failed to export PDF");
  }
};

  const handleExportExcel = async () => {
  try {
    const response = await axiosInstance.get(
      "/reports/export/excel",
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      "renewals-report.xlsx"
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (err) {
    toast.error("Failed to export Excel");
  }
};

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="Generate and export renewal reports"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Reports' }]}
      />

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          p: 3,
          mb: 3
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={setFromDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={setToDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(RENEWAL_STATUS).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PictureAsPdfOutlinedIcon />}
                  onClick={handleExportPDF}
                >
                  PDF
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GridOnOutlinedIcon />}
                  onClick={handleExportExcel}
                >
                  Excel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
<Grid container spacing={2} sx={{ mb: 3 }}>
  <Grid item xs={12} sm={6} md={3}>
    <ChartCard title="Customers">
      <h2>{summary?.totalCustomers ?? 0}</h2>
    </ChartCard>
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <ChartCard title="Products">
      <h2>{summary?.totalProducts ?? 0}</h2>
    </ChartCard>
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <ChartCard title="Renewals">
      <h2>{summary?.totalRenewals ?? 0}</h2>
    </ChartCard>
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <ChartCard title="Revenue">
      <h2>₹{summary?.totalRevenue ?? 0}</h2>
    </ChartCard>
  </Grid>
</Grid>
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <ChartCard title="Renewals Report" subtitle="Filtered renewal volume over time">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRenewals}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ReTooltip />
                <Bar dataKey="renewals" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
