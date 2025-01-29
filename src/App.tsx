// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Router>
      {/* ToastContainer può stare ovunque, 
          ma di solito lo si mette una volta in alto all’App */}
      <ToastContainer />

      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
