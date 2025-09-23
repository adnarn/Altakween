import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {ProtectedRoute} from './components/ProtectedRoute';
import './App.css';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import PackageDetails from './pages/PackageDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import Unauthorized from './pages/Unauthorized';

function AppContent() {
  return (
    <div className="font-sans antialiased text-gray-800 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Protected routes for all authenticated users */}
          <Route path="/services" element={
            <ProtectedRoute allowedRoles={["client", "admin"]}>
              <Services />
            </ProtectedRoute>
          } />
          <Route path="/package/:id" element={
            <ProtectedRoute allowedRoles={["client", "admin"]}>
              <PackageDetails />
            </ProtectedRoute>
          } />
          {/* Admin-only routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
