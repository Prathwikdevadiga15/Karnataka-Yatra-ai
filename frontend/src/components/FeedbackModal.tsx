import React, { useState } from "react";
import { submitFeedback } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import { X, Star, Send, CheckCircle2 } from "lucide-react";

interface FeedbackModalProps {
  tripId?: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ tripId, onClose }) => {
  const { language } = useLanguage();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("heritage");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await submitFeedback({
        trip_id: tripId,
        rating,
        comment,
        category
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      alert("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-charcoal">
              {language === "kn" ? "ಧನ್ಯವಾದಗಳು!" : "Thank You!"}
            </h3>
            <p className="text-xs text-gray-600">
              {language === "kn"
                ? "ನಿಮ್ಮ ಅನಿಸಿಕೆ ಕರ್ನಾಟಕ ಪ್ರವಾಸೋದ್ಯಮ ಅನುಭವವನ್ನು ಇನ್ನಷ್ಟು ಉತ್ತಮಗೊಳಿಸಲು ನೆರವಾಗುತ್ತದೆ."
                : "Your authentic feedback helps enhance Karnataka Yatra AI's cultural and route accuracy."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-forest">
                {language === "kn" ? "ಪ್ರವಾಸದ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ" : "Rate Your Journey Experience"}
              </h3>
              <p className="text-xs text-gray-500">
                Help us improve route feasibility and historical authenticity.
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center space-x-2 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-gray-700 ml-2">
                {rating} / 5 Stars
              </span>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Feedback Focus
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:outline-none"
              >
                <option value="heritage">Cultural & Heritage Accuracy</option>
                <option value="budget">Budget Feasibility</option>
                <option value="routes">Driving Routes & Road Time</option>
                <option value="kannada">Kannada Language & Voice Usability</option>
                <option value="general">General Experience</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Comments & Suggestions
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience or regional suggestions..."
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-forest text-ivory text-xs font-bold rounded-lg hover:bg-forest/90 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-gold" />
              <span>{submitting ? "Submitting..." : "Submit Feedback"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
