import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Feed from "./pages/Feed";
import Planner from "./pages/Planner";
import Profile from "./pages/Profile";
import Compare from "./pages/Compare";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;