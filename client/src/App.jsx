// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import Home from './pages/Home';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import {ProtectedRoute} from './components/ProtectedRoute';
// import './App.css';
// import Contact from './pages/Contact';
// import About from './pages/About';
// import Services from './pages/Services';
// import PackageDetails from './pages/PackageDetails';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import Unauthorized from './pages/Unauthorized';
// import Users from './pages/admin/Users';
// import Profile from './pages/Profile';
// import AdminLayout from './components/admin/AdminLayout';

// function AppContent() {
//   return (
//     <div className="font-sans antialiased text-gray-800 min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/profile" element={<Profile />} />
//           {/* Protected routes for all authenticated users */}
//           <Route path="/services" element={
//             <ProtectedRoute allowedRoles={["client", "admin"]}>
//               <Services />
//             </ProtectedRoute>
//           } />
//           <Route path="/package/:id" element={
//             <ProtectedRoute allowedRoles={["client", "admin"]}>
//               <PackageDetails />
//             </ProtectedRoute>
//           } />
//           {/* Admin-only routes */}
//           <Route path="/admin" element={
//             <ProtectedRoute allowedRoles={["admin"]}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/admin/users" element={
//             <ProtectedRoute allowedRoles={["admin"]}>
//               <Users />
//             </ProtectedRoute>
//           } />
//           {/* Unauthorized page */}
//           <Route path="/unauthorized" element={<Unauthorized />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }


// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <AppContent />
//         <AdminContent />
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


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
import Users from './pages/admin/Users';
import Profile from './pages/Profile';
import AdminLayout from './components/admin/AdminLayout';
import { ClientLayout } from './components/ClientLayout';
import Packages from './pages/admin/Packages';
import Bookings from './components/admin/Bookings';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Client Routes */}
            <Route
              path="/"
              element={
                <ClientLayout>
                  <Home />
                </ClientLayout>
              }
            />
            <Route
              path="/services"
              element={
                <ClientLayout>
                  <Services />
                </ClientLayout>
              }
            />
            <Route
              path="/about"
              element={
                <ClientLayout>
                  <About />
                </ClientLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <ClientLayout>
                  <Contact />
                </ClientLayout>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <Users />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/packages"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <Packages />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <Bookings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
