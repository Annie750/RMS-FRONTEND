import axiosInstance from "../api/axiosInstance";

const getSummary = () => axiosInstance.get("/dashboard/summary").then((r) => r.data);
const getMonthlyRenewals = () => axiosInstance.get("/dashboard/monthly-renewals").then((r) => r.data);
const getRevenueTrend = () => axiosInstance.get("/dashboard/revenue-trend").then((r) => r.data);
const getProductDistribution = () => axiosInstance.get("/dashboard/product-distribution").then((r) => r.data);
const getRenewalStatus = () => axiosInstance.get("/dashboard/renewal-status").then((r) => r.data);
const getRecentRenewals = () => axiosInstance.get("/dashboard/recent-renewals").then((r) => r.data);
const getUpcomingRenewals = () => axiosInstance.get("/dashboard/upcoming-renewals").then((r) => r.data);

const dashboardService = {
  getSummary,
  getMonthlyRenewals,
  getRevenueTrend,
  getProductDistribution,
  getRenewalStatus,
  getRecentRenewals,
  getUpcomingRenewals
};

export default dashboardService;
