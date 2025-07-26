import React from "react";
import "./App.css";
import "./styles/animations.css";
import "./styles/theme.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIProvider } from "./contexts/AIContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Feed from "./pages/Feed";
import Planner from "./pages/Planner";
import Profile from "./pages/Profile";
import Compare from "./pages/Compare";
import ColorSystemDemo from "./components/ColorSystemDemo";

function App() {
  return (
    <ThemeProvider>
      <div className="App dark-mode-transition">
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
                <Route path="/color-demo" element={<ColorSystemDemo />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AIProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;