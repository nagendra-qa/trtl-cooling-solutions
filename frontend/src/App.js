import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Customers from './pages/Customers';
import Camps from './pages/Camps';
import WorkOrders from './pages/WorkOrders';
import Bills from './pages/Bills';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/camps" element={<Camps />} />
          <Route path="/workorders" element={<WorkOrders />} />
          <Route path="/bills" element={<Bills />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
