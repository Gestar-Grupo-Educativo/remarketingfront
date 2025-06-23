import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/ui/NavBar';
import LeadList from './components/leads/LeadList';
import LeadDetail from './components/leads/LeadDetail';
import RemarketingConfig from './components/config/RemarketingConfig';
import Logs from './components/logs/Logs';
import Stats from './components/stats/Stats';


export default function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<LeadList />} />
          <Route path="/lead/:id" element={<LeadDetail />} />
          <Route path="/config" element={<RemarketingConfig />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/stats" element={<Stats />} />

        </Routes>
      </div>
    </Router>
  );
}
