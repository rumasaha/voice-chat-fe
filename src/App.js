// import React from "react";
// import VoiceChat from "./components/VoiceChat";
// import ChatHistory from "./components/ChatHistory"; // Import the ChatHistory component

// function App() {
//   return (
//     <div className="App">
//       <VoiceChat />
//       <ChatHistory /> {/* This will display the stored chats */}
//     </div>
//   );
// }

// export default App;


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
