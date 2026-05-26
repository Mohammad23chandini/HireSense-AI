import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  BrainCircuit,
  MessageSquareText,
} from "lucide-react";

function App() {
  const [started, setStarted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [fillerCount, setFillerCount] = useState(0);
  const [confidence, setConfidence] = useState(100);
  const [feedback, setFeedback] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let currentTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + " ";
      }

      setTranscript(currentTranscript);

      // Filler Word Detection
      const fillerWords = [
        "um",
        "uh",
        "like",
        "basically",
        "actually",
      ];

      let count = 0;

      const words = currentTranscript
        .toLowerCase()
        .replace(/[.,!?]/g, "")
        .split(" ");

      words.forEach((word) => {
        if (fillerWords.includes(word)) {
          count++;
        }
      });

      setFillerCount(count);

      // Confidence Score
      let score = 100 - count * 10;

      if (score < 0) {
        score = 0;
      }

      setConfidence(score);

      // AI Feedback
      if (count === 0) {
        setFeedback(
          "Excellent communication clarity with confident speech."
        );
      } else if (count <= 3) {
        setFeedback(
          "Good speaking style, but try reducing filler words."
        );
      } else {
        setFeedback(
          "You use many filler words. Try pausing instead of saying 'um' or 'like'."
        );
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  // Landing Page
  if (!started) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-bold"
          >
            HireSense AI
          </motion.h1>

          <p className="text-gray-400 mt-6 text-lg max-w-2xl">
            Practice interviews with AI-powered feedback,
            voice analysis, and real-time communication insights.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStarted(true)}
            className="mt-10 bg-white text-black px-8 py-4 rounded-full text-lg font-semibold"
          >
            Start Interview
          </motion.button>

        </div>
      </div>
    );
  }

  // Interview Dashboard
  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold mb-10">
        AI Interview Session
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* AI Interviewer Panel */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

          <div className="flex items-center gap-3 mb-6">
            <BrainCircuit className="text-cyan-400" />

            <h2 className="text-2xl font-semibold">
              AI Interviewer
            </h2>
          </div>

          <p className="text-gray-400 leading-7">
            Tell me about yourself and explain your
            strongest technical skill.
          </p>

        </div>

        {/* Microphone Panel */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center">

          <motion.div
            onClick={toggleListening}
            animate={{
              scale: listening ? [1, 1.1, 1] : 1,
            }}
            transition={{
              repeat: listening ? Infinity : 0,
              duration: 2,
            }}
            className="bg-cyan-500/20 p-10 rounded-full cursor-pointer"
          >
            <Mic className="w-16 h-16 text-cyan-400" />
          </motion.div>

          <p className="mt-6 text-gray-400">
            {listening
              ? "Listening..."
              : "Click Mic to Speak"}
          </p>

        </div>

        {/* Transcript Panel */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

          <div className="flex items-center gap-3 mb-6">
            <MessageSquareText className="text-pink-400" />

            <h2 className="text-2xl font-semibold">
              Live Transcript
            </h2>
          </div>

          <p className="text-gray-400 leading-7">
            {transcript ||
              "Your response will appear here in real time..."}
          </p>

          {/* Scores */}
          <div className="mt-6">
            <p className="text-red-400 font-semibold">
              Filler Words Used: {fillerCount}
            </p>

            <p className="text-cyan-400 font-semibold mt-3">
              Confidence Score: {confidence}%
            </p>
          </div>

          {/* AI Feedback */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-2 text-cyan-400">
              AI Feedback
            </h3>

            <p className="text-gray-300 leading-7">
              {feedback}
            </p>
          </div>

          {/* Performance Meters */}
          <div className="mt-8 space-y-5">

            {/* Confidence Meter */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-300">
                  Confidence
                </span>

                <span className="text-sm text-cyan-400">
                  {confidence}%
                </span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-cyan-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
            </div>

            {/* Fluency Meter */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-300">
                  Fluency
                </span>

                <span className="text-sm text-pink-400">
                  {Math.max(100 - fillerCount * 8, 0)}%
                </span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-pink-400 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      100 - fillerCount * 8,
                      0
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;