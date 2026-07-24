import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminApp from './admin/AdminApp';
import { Toaster } from './components/ui/toaster';

function CustomerShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-80px)]">{children}</main>
      <Footer />
    </>
  );
}

function Layout() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    );
  }
  return (
    <CustomerShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </CustomerShell>
  );
}

function App() {
  return (
    <div className="App min-h-screen bg-[#FCF9EE] text-zinc-100">
      <BrowserRouter>
        <Layout />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
