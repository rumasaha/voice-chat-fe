import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

// The speech recognition API initialization
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
let isRecognitionActive = false;

function VoiceChat() {
  const [status, setStatus] = useState("Waiting for response...");
  const [showAIText, setShowAIText] = useState(false);
  const [micIcon, setMicIcon] = useState("/assets/mic-off.png");
  const [aiTextResponse, setAiTextResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const navigate = useNavigate(); 
  // Start the speech recognition
  const startRecognition = useCallback(() => {
    if (!isRecognitionActive) {
      console.log("🎙️ Starting recognition...");
      setMicIcon("/assets/mic-on.gif");
      recognition.start();
      isRecognitionActive = true;
    }
  }, []);

  // Stop the speech recognition
  const stopRecognition = () => {
    if (isRecognitionActive) {
      console.log("🛑 Stopping recognition...");
      recognition.stop();
      isRecognitionActive = false;
      setMicIcon("/assets/mic-off.png");
    }
  };

  recognition.onresult = async (event) => {
    stopRecognition();
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log("🎙️ You said:", transcript);

    setStatus("Processing...");

    try {
      // Send the user message to the backend for processing
      const response = await fetch("http://localhost:5001/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: transcript, }),
      });

      if (!response.ok) throw new Error("Failed to get response from server");

      // Get the AI response (text and audio)
      const { textResponse, audioUrl } = await response.json();

    // Step 2: Store chat automatically in MongoDB
    fetch("http://localhost:5001/store-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: transcript, aiResponse: textResponse })
    })
    .then(response => response.json())
    .then(storeData => console.log("💾 Chat Stored:", storeData))
    .catch(error => console.error("❌ Error storing chat:", error));

      setAiTextResponse(textResponse);
      setAudioUrl(audioUrl);

      setShowAIText(true);
      setStatus("AI is speaking...");

      const audio = new Audio(audioUrl);
      audio.play();

      audio.onended = () => {
        setShowAIText(false);
        setStatus("Waiting for response...");
        setTimeout(() => {
          startRecognition();
        }, 2000);
      };
    } catch (error) {
      console.error("❌ Error:", error);
      setStatus("Error");
      setTimeout(() => {
        startRecognition();
      }, 2000);
    }
  };

  const safeStartRecognition = useCallback(() => {
    if (recognition && recognition.state !== "listening") {
      console.log("🎙️ Restarting recognition...");
      recognition.start();
    }
  }, []);

  recognition.onerror = (event) => {
    console.error("❌ Speech Recognition Error:", event.error);

    if (event.error === "no-speech") {
      setStatus("No speech detected, try again! 🎤");
    } else {
      setStatus("Error");
    }

    setTimeout(() => {
      safeStartRecognition();
    }, 2000);
  };

  useEffect(() => {
    startRecognition();
    return () => stopRecognition();
  }, [startRecognition]);

  const statusIcons = {
    "Processing...": "/assets/background-processing.jpg",
    "AI is speaking...": "/assets/AI_speaking.gif",
    "Waiting for response...": "/assets/mic-on.gif",
    "User is speaking...": "/assets/mic-on.gif",
    "Error": "/assets/background-error.jpg",
  };

  return (
    <div
      style={{
        backgroundImage: "url('/assets/background.jpg')",
        backgroundSize: "cover",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        padding: "100px 0",
      }}
    >
      <h1 className="status-title">AI Voice Chat</h1>

      {showAIText && (
        <p className="status-text">
          {status === "Error"
            ? "⚠️ Error!"
            : status === "AI is speaking..."
            ? "🗣️ AI Talking..."
            : status === "User is speaking..."
            ? "🎤 You’re speaking..."
            : "🎤 Waiting for input..."}
        </p>
      )}

      <img className="status-image" src={statusIcons[status]} alt={status} />

      {aiTextResponse && <p className="ai-text-response">{aiTextResponse}</p>}

      <img className="mic-icon" src={micIcon} alt="Microphone" onClick={startRecognition} />
      <div>
      <h2>Voice Chat Page</h2>
      <button onClick={() => navigate("/chat-history")}>Open Chat History</button>
    </div>
    </div>
  );
}

export default VoiceChat;
