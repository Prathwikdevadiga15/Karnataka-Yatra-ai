import React, { useState, useRef, useEffect } from "react";
import { useTrip } from "../context/TripContext";
import { useLanguage } from "../context/LanguageContext";
import { sendChatMessage, sendVoiceQuery, replaceItineraryStop } from "../services/api";
import type { ChatMessage, Plan } from "../types";
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Bot,
  User,
  ArrowRight,
  PlusCircle,
  RefreshCw
} from "lucide-react";

export default function Assistant() {
  const { currentPlan, setCurrentPlan } = useTrip();
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "assistant",
      text:
        language === "kn"
          ? "ನಮಸ್ಕಾರ! ನಾನು ಕರ್ನಾಟಕ ಯಾತ್ರಾ AI ಸಾಂಸ್ಕೃತಿಕ ಸಹಾಯಕ. ಹಂಪಿ, ಮೈಸೂರು, ಕರಾವಳಿ, ಮಲೆನಾಡು ಸೇರಿದಂತೆ ಕರ್ನಾಟಕದ ಯಾವುದೇ ಪ್ರವಾಸಿ ತಾಣ, ಐತಿಹಾಸಿಕ ಹಿನ್ನೆಲೆ, ಮಾರ್ಗಗಳು ಮತ್ತು ಬಜೆಟ್ ಕುರಿತು ನನಗೆ ಕೇಳಬಹುದು."
          : "Namaskara! I am your Karnataka Yatra AI assistant. Ask me about historical monuments, regional food, budget optimization, or modifying your active itinerary.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    {
      en: "Tell me about Hampi's UNESCO ruins and history",
      kn: "ಹಂಪಿಯ ವಿಜಯನಗರ ಇತಿಹಾಸ ಮತ್ತು ಸ್ಮಾರಕಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ"
    },
    {
      en: "What are the timings and entry fee for Mysuru Palace?",
      kn: "ಮೈಸೂರು ಅರಮನೆ ಭೇಟಿ ಸಮಯ ಮತ್ತು ಟಿಕೆಟ್ ದರ ಎಷ್ಟು?"
    },
    {
      en: "How can I reduce my itinerary budget by ₹5,000?",
      kn: "ನನ್ನ ಪ್ರವಾಸದ ಬಜೆಟ್ ₹5000 ಕಡಿಮೆ ಮಾಡುವುದು ಹೇಗೆ?"
    },
    {
      en: "Suggest a 3-day coastal seafood and temple trail",
      kn: "3 ದಿನಗಳ ಕರಾವಳಿ ದೇವಸ್ಥಾನ ಮತ್ತು ಆಹಾರ ಪ್ರವಾಸ ತಿಳಿಸಿ"
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(text.trim(), currentPlan, language);
      const assistantMsg: ChatMessage = {
        id: "assistant-" + Date.now(),
        sender: "assistant",
        text: res.reply,
        sources: res.sources,
        suggestedAction: res.suggested_action,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: "error-" + Date.now(),
        sender: "assistant",
        text: "I encountered an error retrieving data. Please ensure the backend is active.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Voice Input (Web Speech API / Azure Speech fallback)
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      // Fallback: Trigger default sample query
      const sample = language === "kn" ? "ಹಂಪಿಯ ಇತಿಹಾಸವೇನು?" : "Tell me about Hampi ruins";
      handleSend(sample);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === "kn" ? "kn-IN" : "en-IN";
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      const fallbackPhrase = language === "kn" ? "ಮೈಸೂರು ಅರಮನೆ ಮಾಹಿತಿ" : "Mysuru Palace guide";
      handleSend(fallbackPhrase);
    }
  };

  // Text-To-Speech Playback
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "kn" ? "kn-IN" : "en-IN";
      utterance.rate = 0.95;
      utterance.onstart = () => setSpeechActive(true);
      utterance.onend = () => setSpeechActive(false);
      utterance.onerror = () => setSpeechActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleExecuteAction = async (action: any) => {
    if (!currentPlan) return;
    if (action.type === "add_stop" && action.destination_id) {
      try {
        setLoading(true);
        // Swap last stop or append
        const lastStop = currentPlan.days[currentPlan.days.length - 1].stop;
        const updated = await replaceItineraryStop(currentPlan, lastStop, action.destination_id);
        setCurrentPlan(updated);
        setMessages((prev) => [
          ...prev,
          {
            id: "system-" + Date.now(),
            sender: "assistant",
            text: `✅ Successfully added ${action.destination_name} to your active itinerary!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      } catch (err: any) {
        alert("Failed to modify: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-gold mb-1">
            <Sparkles className="w-4 h-4 text-forest" />
            <span>Culturally Grounded RAG AI</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-forest">
            {language === "kn" ? "ಕರ್ನಾಟಕ ಯಾತ್ರಾ AI ಸಹಾಯಕ" : "Karnataka Cultural & Trip Assistant"}
          </h1>
        </div>

        {currentPlan && (
          <span className="hidden sm:inline-block text-[11px] font-semibold bg-forest/10 text-forest px-3 py-1 rounded-full border border-forest/20">
            Aware of {currentPlan.days.length}-Day Plan
          </span>
        )}
      </div>

      {/* Suggested Prompts Strip */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          Suggested Cultural Queries
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p, idx) => {
            const promptText = language === "kn" ? p.kn : p.en;
            return (
              <button
                key={idx}
                onClick={() => handleSend(promptText)}
                className="text-xs px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-gold hover:text-forest text-gray-700 shadow-sm transition text-left"
              >
                {promptText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Thread Box */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md h-[460px] flex flex-col overflow-hidden">
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser ? "bg-forest text-ivory" : "bg-gold/20 text-gold border border-gold/40"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-forest" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? "bg-forest text-ivory rounded-tr-none shadow-sm"
                      : "bg-gray-50 text-charcoal rounded-tl-none border border-gray-100 shadow-sm space-y-3"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Audio Narrate Button for Assistant */}
                  {!isUser && (
                    <div className="flex items-center space-x-2 pt-1 border-t border-gray-200/60 text-gray-500">
                      <button
                        onClick={() => speakText(m.text)}
                        className="hover:text-forest transition flex items-center space-x-1 text-[11px] font-medium"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-forest" />
                        <span>Listen ({language === "kn" ? "ಕೇಳಿ" : "Speak"})</span>
                      </button>
                    </div>
                  )}

                  {/* Verified Sources Badges */}
                  {!isUser && m.sources && m.sources.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-gray-200/60">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Grounding Citations
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((s, i) => (
                          <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 bg-white border border-gray-200 text-forest text-[10px] px-2 py-0.5 rounded-full hover:border-gold transition"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>{s.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Executable Itinerary Action Button */}
                  {!isUser && m.suggestedAction && (
                    <div className="pt-2">
                      <button
                        onClick={() => handleExecuteAction(m.suggestedAction)}
                        className="w-full py-2 px-3 bg-forest text-ivory text-xs font-semibold rounded-xl hover:bg-forest/90 transition flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-gold" />
                        <span>{m.suggestedAction.label}</span>
                      </button>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isUser ? "text-ivory/60" : "text-gray-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-gray-400 p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-forest" />
              <span>Checking Karnataka tourism knowledge base...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-gray-50 border-t flex items-center space-x-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl border transition ${
              isRecording
                ? "bg-red-500 text-white border-red-600 animate-pulse"
                : "bg-white text-forest border-gray-200 hover:bg-gray-100"
            }`}
            title="Speak query (Kannada / English)"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={
              language === "kn"
                ? "ಕರ್ನಾಟಕದ ಯಾವುದೇ ತಾಣ ಅಥವಾ ಮಾರ್ಗದ ಬಗ್ಗೆ ಕೇಳಿ..."
                : "Ask about history, food, road times, or budget..."
            }
            className="flex-1 text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:outline-none bg-white"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-forest text-ivory rounded-xl hover:bg-forest/90 transition disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-gold" />
          </button>
        </div>
      </div>
    </div>
  );
}
