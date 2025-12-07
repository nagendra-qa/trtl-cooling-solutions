import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for better initial load performance
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Locations = lazy(() => import('./pages/Locations'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading component
const Loading = () => (
  <div className="loading">Loading...</div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin Routes - No Navbar */}
          <Route path="/admin" element={
            <Suspense fallback={<Loading />}>
              <AdminLogin />
            </Suspense>
          } />
          <Route path="/admin/dashboard" element={
            <Suspense fallback={<Loading />}>
              <AdminDashboard />
            </Suspense>
          } />

          {/* Public Routes - With Navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Suspense>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
