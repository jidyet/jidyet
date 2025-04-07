import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Futures from './Pages/Futures';
import Assets from './Pages/Assets';
import Perpetual from './Pages/Perpetual';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/futures" element={<Futures />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/perpetual" element={<Perpetual />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
