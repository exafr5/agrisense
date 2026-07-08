import React, { useState, useRef, useEffect } from "react";
import { Send, Leaf, Sparkles, User, RefreshCw, CheckCircle2, ChevronRight, HelpCircle, History } from "lucide-react";
import { DiagnosisResult, LanguageCode } from "../types";
import { TRANSLATIONS } from "../utils/translations";
import { simulateClientChat } from "../utils/clientSimulator";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  diagnosis?: DiagnosisResult | null;
}

interface DiagnosticChatProps {
  offlineMode: boolean;
  language?: LanguageCode;
  onNewDiagnosis: (result: DiagnosisResult) => void;
  onOpenReport: (result: DiagnosisResult) => void;
}

const WELCOME_MESSAGES: Record<LanguageCode, string> = {
  en: "Hello! I am your AgriSense AI Agronomist. Describe your crop type and any visual symptoms on its foliage (e.g. spot shape, concentric target rings, greasy spots, wilting) and I will diagnose it in real-time.",
  hi: "नमस्ते! मैं आपका एआई कृषि विशेषज्ञ हूँ। अपनी फसल का प्रकार और उसकी पत्तियों पर दिखने वाले लक्षणों (जैसे धब्बे का आकार, संकेंद्रीय छल्ले, तैलीय धब्बे, मुरझाना) का वर्णन करें और मैं वास्तविक समय में इसका निदान करूँगा।",
  pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਏਆਈ ਖੇਤੀਬਾੜੀ ਮਾਹਰ ਹਾਂ। ਆਪਣੀ ਫ਼ਸਲ ਦੀ ਕਿਸਮ ਅਤੇ ਪੱਤਿਆਂ 'ਤੇ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ ਅਤੇ ਮੈਂ ਤੁਰੰਤ ਇਸਦਾ ਇਲਾਜ ਲੱਭਾਂਗਾ।",
  te: "నమస్కారం! నేను మీ AI వ్యవసాయ శాస్త్రవేత్తను. మీ పంట రకం మరియు ఆకులపై ఉన్న లక్షణాలను వివరించండి, నేను తక్షణమే వ్యాధి నిర్ధారణ చేస్తాను.",
  ta: "வணக்கம்! நான் உங்கள் AI வேளாண் நிபுணர். உங்கள் பயிர் வகை மற்றும் இலையில் உள்ள அறிகுறிகளை விவரிக்கவும், நான் நிகழ்நேரத்தில் நோயைக் கண்டறிவேன்.",
  mr: "नमस्कार! मी तुमचा AI कृषी तज्ज्ञ आहे. तुमच्या पिकाचा प्रकार आणि पानावरील लक्षणे सांगा, मी त्वरित रोगनिदान करेन.",
  bn: "হ্যালো! আমি আপনার AI কৃষিবিদ। আপনার ফসলের ধরণ এবং পাতার লক্ষণগুলি বর্ণনা করুন, আমি রিয়েল-টাইমে রোগ নির্ণয় করব।",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ತಜ್ಞ. ನಿಮ್ಮ ಬೆಳೆ ಪ್ರಕಾರ ಮತ್ತು ಎಲೆಯ ಮೇಲಿರುವ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ, ನಾನು ತಕ್ಷಣ ರೋಗನಿರ್ಣಯ ಮಾಡುತ್ತೇನೆ."
};

const SUGGESTIONS_PRESETS: Record<LanguageCode, string[]> = {
  en: [
    "Tomato leaf with brown spots & concentric circles",
    "Pepper leaf with black greasy dots and yellow halos",
    "Paddy leaf with eye-shaped brown lesions",
    "My cotton leaves are wilting with greasy lesions"
  ],
  hi: [
    "टमाटर की पत्ती पर भूरे धब्बे और संकेंद्रीय छल्ले",
    "मिर्च की पत्ती पर काले तैलीय धब्बे और पीले घेरे",
    "धान की पत्ती पर आंख के आकार के भूरे घाव",
    "कपास की पत्तियां तैलीय धब्बों के साथ मुरझा रही हैं"
  ],
  pa: [
    "ਟਮਾਟਰ ਦੇ ਪੱਤੇ 'ਤੇ ਭੂਰੇ ਧੱਬੇ ਅਤੇ ਗੋਲ ਚੱਕਰ",
    "ਮਿਰਚ ਦੇ ਪੱਤੇ 'ਤੇ ਕਾਲੇ ਤੇਲ ਵਰਗੇ ਧੱਬੇ",
    "ਝੋਨੇ ਦੇ ਪੱਤੇ 'ਤੇ ਅੱਖ ਵਰਗੇ ਭੂਰੇ ਨਿਸ਼ਾਨ",
    "ਕਪਾਹ ਦੇ ਪੱਤੇ ਮੁਰਝਾ ਰਹੇ ਹਨ"
  ],
  te: [
    "టమోటా ఆకుపై గోధుమ రంగు మచ్చలు మరియు వలయాలు",
    "మిరప ఆకుపై నల్లటి జిడ్డు మచ్చలు",
    "వరి ఆకుపై కంటి ఆకారపు గోధుమ మచ్చలు",
    "పత్తి ఆకులు జిడ్డు మచ్చలతో వాడిపోతున్నాయి"
  ],
  ta: [
    "தக்காளி இலையில் பழுப்பு நிற புள்ளிகள் மற்றும் வட்டங்கள்",
    "மிளகாய் இலையில் கருப்பு புள்ளிகள்",
    "நெல் இலையில் கண் வடிவ பழுப்பு நிற புண்கள்",
    "பருத்தி இலைகள் வாడి வதங்குகின்றன"
  ],
  mr: [
    "टोमॅटोच्या पानावर तपकिरी डाग आणि गोल कडे",
    "मिरचीच्या पानावर काळे तेलकट डाग",
    "भाताच्या पानावर डोळ्याच्या आकाराचे तपकिरी डाग",
    "कापसाची पाने कोमेजून डाग पडत आहेत"
  ],
  bn: [
    "টমেটোর পাতায় বাদামী দাগ এবং বৃত্তাকার বলয়",
    "মরিচের পাতায় কালো চিটচিটে দাগ",
    "ধানের পাতায় চোখের মতো বাদামী দাগ",
    "তুলার পাতাগুলি শুকিয়ে যাচ্ছে এবং দাগ পড়ছে"
  ],
  kn: [
    "ಟೊಮೆಟೊ ಎಲೆಯ ಮೇಲೆ ಕಂದು ಬಣ್ಣದ ಕಲೆಗಳು ಮತ್ತು ವಲಯಗಳು",
    "ಮೆಣಸಿನಕಾಯಿ ಎಲೆಯ ಮೇಲೆ ಕಪ್ಪು ಜಿಡ್ಡು ಕಲೆಗಳು",
    "ಭತ್ತದ ಎಲೆಯ ಮೇಲೆ ಕಣ್ಣಿನ ಆಕಾರದ ಕಂದು ಕಲೆಗಳು",
    "ಹತ್ತಿ ಎಲೆಗಳು ಸೊರಗಿ ಒಣಗುತ್ತಿವೆ"
  ]
};

export default function DiagnosticChat({ offlineMode, language = "en", onNewDiagnosis, onOpenReport }: DiagnosticChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [savedDiagnoses, setSavedDiagnoses] = useState<string[]>([]); // To avoid double saving same chat result

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  // Set initial welcome message translated
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
      }
    ]);
  }, [language]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // Small timeout to allow render completion of new messages
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: "msg_" + Date.now(),
      role: "user",
      content: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMsg]
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.role === "user" ? "user" : "model",
          content: m.content
        }));

      let data;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatHistory,
            offlineSimulated: offlineMode,
            language
          })
        });

        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }
        data = await response.json();
      } catch (chatErr) {
        console.warn("Backend API not reachable. Using client-side chat fallback:", chatErr);
        data = simulateClientChat(textToSend, language);
      }

      const modelMsg: Message = {
        id: "msg_" + Date.now() + "_reply",
        role: "model",
        content: data.reply,
        diagnosis: data.diagnosis
      };

      setMessages(prev => [...prev, modelMsg]);

      // If a diagnosis is generated in real-time, let's automatically add it to global history!
      if (data.diagnosis) {
        const diagId = data.diagnosis.cropName + "_" + data.diagnosis.diseaseName;
        if (!savedDiagnoses.includes(diagId)) {
          onNewDiagnosis(data.diagnosis);
          setSavedDiagnoses(prev => [...prev, diagId]);
        }
      }

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: "msg_error",
          role: "model",
          content: language === "hi" 
            ? "क्षमा करें, मुझे कनेक्शन त्रुटि का सामना करना पड़ा। कृपया अपना कनेक्शन सत्यापित करें और अपने लक्षण फिर से लिखें।" 
            : "Sorry, I ran into a connection error. Please verify your connection status and write your symptoms again."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const suggestions = SUGGESTIONS_PRESETS[language] || SUGGESTIONS_PRESETS.en;

  return (
    <div className="bg-white border border-surface-high rounded-3xl overflow-hidden shadow-xl flex flex-col h-[550px] animate-fadeIn">
      {/* Header Info Area */}
      <div className="bg-primary px-6 py-4 text-white flex justify-between items-center shrink-0 border-b border-primary-light/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-highlight/20 flex items-center justify-center border border-highlight/40">
            <Leaf size={18} className="text-highlight fill-highlight/20" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-highlight">AI Agronomist Advisor</h4>
            <p className="text-[10px] text-gray-300 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Real-time Foliage Symptoms Matcher
            </p>
          </div>
        </div>

        {offlineMode && (
          <span className="text-[9px] font-mono font-bold bg-amber-500/25 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-md animate-pulse">
            Local Fallback Model Active
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-gray-50/50 to-white space-y-4"
      >
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex gap-3 max-w-[85%] ${
              m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${
              m.role === "user" 
                ? "bg-primary-fixed border-primary-fixed text-primary-dark" 
                : "bg-surface-low border-surface-high text-primary"
            }`}>
              {m.role === "user" ? <User size={14} /> : <Leaf size={14} />}
            </div>

            {/* Bubble content */}
            <div className="space-y-3">
              <div className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm border ${
                m.role === "user" 
                  ? "bg-primary text-white border-primary" 
                  : "bg-background border-surface-high text-on-surface"
              }`}>
                {m.content}
              </div>

              {/* Inline Diagnosis Card if match occurs */}
              {m.role === "model" && m.diagnosis && (
                <div className="bg-primary-fixed/20 border border-primary-fixed/60 rounded-2xl p-4 space-y-3 shadow-md text-left animate-fadeIn">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-mono text-[9px] text-highlight bg-primary/10 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        Real-time match detected
                      </span>
                      <h5 className="font-serif font-bold text-sm sm:text-base text-primary mt-1.5">
                        {m.diagnosis.diseaseName}
                      </h5>
                      <p className="font-mono text-[10px] italic text-on-surface-variant mt-0.5">
                        {m.diagnosis.scientificName}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block font-serif text-lg font-bold text-primary">
                        {m.diagnosis.confidence}%
                      </span>
                      <span className="text-[9px] font-mono text-on-surface-variant font-semibold">
                        Confidence
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed bg-white/40 p-2.5 rounded-xl border border-primary-fixed/20">
                    {m.diagnosis.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button 
                      onClick={() => onOpenReport(m.diagnosis!)}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white text-[11px] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm"
                    >
                      View Treatment Plan <ChevronRight size={12} />
                    </button>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[10px] text-emerald-800 font-bold justify-center">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      Auto-saved to History
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator dots */}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-lg bg-surface-low border border-surface-high text-primary flex items-center justify-center shrink-0">
              <Leaf size={14} className="animate-spin" />
            </div>
            <div className="bg-background border border-surface-high rounded-2xl px-4 py-3 flex items-center gap-1 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Suggestion list on empty chat */}
        {messages.length === 1 && !isTyping && (
          <div className="pt-4 space-y-2">
            <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-on-surface-variant/70 flex items-center gap-1">
              <Sparkles size={11} className="text-highlight fill-highlight/25" />
              Symptom Presets (Quick Start)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestClick(s)}
                  className="bg-white hover:bg-primary-fixed/15 border border-surface-high hover:border-primary-fixed text-left p-2.5 rounded-xl text-xs text-on-surface-variant font-medium active:scale-98 transition-all hover:shadow-sm"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Form Box */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} 
        className="p-3 bg-gray-50 border-t border-surface-high flex gap-2 items-center"
      >
        <input 
          type="text"
          placeholder="Describe leaf symptoms, spots, mold, crop types..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-1 bg-white border border-surface-high rounded-2xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-gray-400 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white w-10 h-10 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-md shrink-0 disabled:pointer-events-none"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
