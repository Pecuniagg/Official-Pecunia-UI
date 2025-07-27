import React from "react";
import "./App.css";
import "./styles/animations.css";
import "./styles/pecunia-theme.css";
import "./styles/ai-assistant-refined.css";
import "./styles/compare-refined.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIProvider } from "./contexts/AIContext";
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
      <AIProvider>
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
      </AIProvider>
    </div>
  );
}

export default App;