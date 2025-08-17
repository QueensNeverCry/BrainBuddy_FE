import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MainPage from "./pages/MainPage";
import WebcamPage from "./pages/WebcamPage";
import AccountDeletion from "./pages/AccountDeletion";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/webcam" element={<WebcamPage />} />
          <Route path="/account-deletion" element={<AccountDeletion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
