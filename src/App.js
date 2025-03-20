import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VoiceChat from "./components/VoiceChat";
import ChatHistory from "./components/ChatHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VoiceChat />} />
        <Route path="/chat-history" element={<ChatHistory />} />
      </Routes>
    </Router>
  );
}

export default App;