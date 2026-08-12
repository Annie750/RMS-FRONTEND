import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Chip } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import StatusChip from '../../components/common/StatusChip';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import dashboardService from '../../services/dashboardService';
import { toast } from 'react-toastify';

const PIE_COLORS = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#0284C7'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyRenewals, setMonthlyRenewals] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [productDistribution, setProductDistribution] = useState([]);
  const [renewalStatus, setRenewalStatus] = useState([]);
  const [recentRenewals, setRecentRenewals] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [
          summaryRes,
          monthlyRes,
          revenueRes,
          productRes,
          statusRes,
          recentRes,
          upcomingRes
        ] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getMonthlyRenewals(),
          dashboardService.getRevenueTrend(),
          dashboardService.getProductDistribution(),
          dashboardService.getRenewalStatus(),
          dashboardService.getRecentRenewals(),
          dashboardService.getUpcomingRenewals()
        ]);
        setSummary(summaryRes);
        setMonthlyRenewals(monthlyRes || []);
        setRevenueTrend(revenueRes || []);
        setProductDistribution(productRes || []);
        setRenewalStatus(statusRes || []);
        setRecentRenewals(recentRes || []);
        setUpcomingRenewals(upcomingRes || []);
      } catch (err) {
        toast.error(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <Loader message="Loading dashboard..." />;

  const stats = [
    {
      title: 'Total Customers',
      value: summary?.totalCustomers ?? 0,
      icon: <PeopleAltOutlinedIcon />,
      color: 'primary'
    },
    {
      title: 'Total Products',
      value: summary?.totalProducts ?? 0,
      icon: <Inventory2OutlinedIcon />,
      color: 'info'
    },
    {
      title: 'Active Renewals',
      value: summary?.activeRenewals ?? 0,
      icon: <AutorenewOutlinedIcon />,
      color: 'success'
    },
    {
      title: 'Expiring Soon',
      value: summary?.expiringSoon ?? 0,
      icon: <WarningAmberOutlinedIcon />,
      color: 'warning'
    },
    {
      title: 'Expired',
      value: summary?.expiredRenewals ?? 0,
      icon: <HighlightOffOutlinedIcon />,
      color: 'error'
    },
    {
      title: 'Revenue',
value: `₹${Number(summary?.totalRevenue ?? 0).toLocaleString()}`,      icon: <PaidOutlinedIcon />,
      color: 'primary'
    }
  ];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your renewals, customers and revenue"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={s.title}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <ChartCard title="Monthly Renewals" subtitle="Renewals created per month">
            {monthlyRenewals.length === 0 ? (
              <EmptyState title="No data" subtitle="No renewal trend data available yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRenewals}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <ReTooltip />
<Bar dataKey="renewals" fill="#2563EB" radius={[6, 6, 0, 0]} />                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Revenue Trend" subtitle="Monthly revenue overview">
            {revenueTrend.length === 0 ? (
              <EmptyState title="No data" subtitle="No revenue trend data available yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <ReTooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Product Distribution" subtitle="Renewals by product">
            {productDistribution.length === 0 ? (
              <EmptyState title="No data" subtitle="No product distribution data available yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
    data={productDistribution}
    dataKey="total"
    nameKey="product"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {productDistribution.map((entry, index) => (
                      <Cell key={entry.product} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Renewal Status" subtitle="Active vs expiring vs expired">
            {renewalStatus.length === 0 ? (
              <EmptyState title="No data" subtitle="No renewal status data available yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={renewalStatus} dataKey="count" nameKey="status" outerRadius={90} label>
                    {renewalStatus.map((entry, index) => (
                      <Cell key={entry.status} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <RenewalMiniTable title="Recent Renewals" rows={recentRenewals} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RenewalMiniTable title="Upcoming Renewals" rows={upcomingRenewals} />
        </Grid>
      </Grid>
    </Box>
  );
};

const RenewalMiniTable = ({ title, rows }) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 4,
        p: 2.5,
        height: '100%'
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {(!rows || rows.length === 0) ? (
        <EmptyState title="No records" subtitle="Nothing to display right now." />
      ) : (
        <Box>
          {rows.map((row) => (
  <Box
    key={`${row.customer}-${row.product}-${row.expiryDate}`}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      py: 1.2,
      borderBottom: "1px solid",
      borderColor: "divider",
      "&:last-of-type": { borderBottom: "none" }
    }}
  >
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
    {row.customer ?? row.customerName}
</Typography>

<Typography variant="caption" color="text.secondary">
    {(row.product ?? row.productName)} • Expires {row.expiryDate}
</Typography>
    </Box>

    {row.daysLeft !== undefined ? (
    <Chip
        color={
            row.daysLeft <= 7
                ? "error"
                : row.daysLeft <= 30
                ? "warning"
                : "info"
        }
        label={`${row.daysLeft} Days Left`}
    />
) : (
    <StatusChip status={row.status} />
)}
  </Box>
))}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
