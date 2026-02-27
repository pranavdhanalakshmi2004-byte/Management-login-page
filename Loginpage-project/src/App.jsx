import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/Admindashboard" element={<Admindashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;