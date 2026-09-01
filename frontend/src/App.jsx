import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetail from './pages/ListingDetail';
import MyBookings from './pages/MyBookings';
import HostDashboard from './pages/HostDashboard';
import CreateListing from './pages/CreateListing';

export default function App() {
  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings/:id" element={<ListingDetail />} />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/dashboard"
          element={
            <ProtectedRoute hostOnly>
              <HostDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/new-listing"
          element={
            <ProtectedRoute hostOnly>
              <CreateListing />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div className="p-10 text-center text-harbor-700">Page not found</div>} />
      </Routes>
    </div>
  );
}
