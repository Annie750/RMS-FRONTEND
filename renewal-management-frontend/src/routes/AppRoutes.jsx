import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import CustomersList from '../pages/customers/CustomersList';
import ProductsList from '../pages/products/ProductsList';
import RenewalsList from '../pages/renewals/RenewalsList';
import UsersList from '../pages/users/UsersList';
import Reports from '../pages/reports/Reports';
import Settings from '../pages/settings/Settings';
import ErrorPage from '../components/common/ErrorPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/renewals" element={<RenewalsList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />

          <Route element={<AdminRoute />}>
            <Route path="/users" element={<UsersList />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<ErrorPage code={404} message="Page not found" />} />
    </Routes>
  );
};

export default AppRoutes;
