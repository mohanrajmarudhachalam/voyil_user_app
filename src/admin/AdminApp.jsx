import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import Overview from './Overview';
import Bookings from './Bookings';
import { getAdminToken, setAdminToken } from '../lib/api';

export default function AdminApp() {
  const [token, setToken] = useState(getAdminToken());

  const onLoggedIn = (t) => {
    setAdminToken(t);
    setToken(t);
  };
  const onSignOut = () => {
    setAdminToken(null);
    setToken('');
  };

  if (!token) return <AdminLogin onLoggedIn={onLoggedIn} />;

  return (
    <Routes>
      <Route element={<AdminLayout onSignOut={onSignOut} />}>
        <Route index element={<Overview />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
