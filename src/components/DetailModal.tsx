import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, X, Play, Square } from "lucide-react";
import { InstructionItem } from "../types";

interface DetailModalProps {
  item: InstructionItem;
  isOpen: boolean;
  onClose: () => void;
  voiceLang?: "zh-HK" | "zh-TW";
}

export default function DetailModal({ item, isOpen, onClose, voiceLang = "zh-HK" }: DetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState<"large" | "larger" | "giant">("larger");
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.8); // Slightly slower for better elder clarity
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Handle auto-stop when closed
  useEffect(() => {
    if (!isOpen && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const speak = () => {
    if (!synthRef.current) return;

    // If currently speaking, stop it
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    synthRef.current.cancel();

    const textToSpeak = item.voiceText || item.fullTip;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    // Set voice options based on chosen language
    utterance.lang = voiceLang; 
    utterance.rate = speechSpeed; 
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech utterance error", e);
      setIsPlaying(false);
    };

    // Try to find a friendly native Cantonese or Mandarin voice
    const voices = synthRef.current.getVoices();
    const targetVoice = voices.find(
      (v) => v.lang.toLowerCase().includes(voiceLang.toLowerCase())
    );
    const fallbackVoice = voices.find(
      (v) => v.lang.toLowerCase().includes("zh")
    );
    if (targetVoice) {
      utterance.voice = targetVoice;
    } else if (fallbackVoice) {
      utterance.voice = fallbackVoice;
    }

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "large":
        return "text-2xl sm:text-3xl leading-relaxed";
      case "larger":
        return "text-3xl sm:text-4xl leading-relaxed font-bold";
      case "giant":
        return "text-4xl sm:text-5xl leading-loose font-extrabold";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            id="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            id="modal-container"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="relative bg-[#FFF8E1] w-full max-w-4xl max-h-[92vh] overflow-y-auto border-[6px] border-[#D84315] rounded-[48px] shadow-[12px_12px_0px_rgba(216,67,21,0.25)] flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 border-b-[6px] border-dashed border-[#D84315] bg-[#FFF3E0]">
              <div className="flex items-center gap-4">
                <span className="text-5xl select-none" role="img" aria-label={item.emoji}>
                  {item.emoji}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-[#D84315] tracking-tight">
                  {item.title}
                </h2>
              </div>
              <button
                id="modal-close-header"
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 bg-[#D84315] hover:bg-[#BF360C] text-white font-extrabold text-xl sm:text-2xl rounded-2xl border-[4px] border-[#1E1E1E] shadow-[5px_5px_0_#1E1E1E] active:translate-y-1 transition-all cursor-pointer"
              >
                <X className="w-8 h-8 stroke-[3]" />
                關閉
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 sm:p-10 flex flex-col items-center">
              
              {/* TTS Audio Controls */}
              <div className="w-full bg-[#FFF3E0] border-[4px] border-[#D84315] rounded-[36px] p-6 sm:p-8 mb-8 shadow-[8px_8px_0_rgba(216,67,21,0.12)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-2xl sm:text-3xl font-black text-[#D84315] flex items-center gap-2">
                      🔊 貼心語音朗讀
                    </span>
                    <span className="text-lg sm:text-xl text-[#5D4037] font-bold mt-2">
                      看得吃力嗎？點擊右側橘紅色巨大按鈕，即可播放語音聽一聽！
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-4">
                    {/* Speed Selector */}
                    <div className="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-2xl border-2 border-gray-300">
                      <span className="text-xs sm:text-sm font-extrabold text-gray-700">選擇語速：</span>
                      <div className="flex gap-1.5">
                        {[
                          { val: 0.6, label: "更慢 🐢" },
                          { val: 0.8, label: "適中 🚶" },
                          { val: 1.1, label: "稍快 ⚡" }
                        ].map((speed) => (
                          <button
                            key={speed.val}
                            id={`speed-${speed.val}`}
                            onClick={() => {
                              setSpeechSpeed(speed.val);
                              if (isPlaying) {
                                stopSpeaking();
                                setTimeout(() => {
                                  const textToSpeak = item.voiceText || item.fullTip;
                                  const utterance = new SpeechSynthesisUtterance(textToSpeak);
                                  utterance.lang = voiceLang;
                                  utterance.rate = speed.val;
                                  const voices = window.speechSynthesis.getVoices();
                                  const targetVoice = voices.find((v) => v.lang.toLowerCase().includes(voiceLang.toLowerCase()));
                                  const fallbackVoice = voices.find((v) => v.lang.toLowerCase().includes("zh"));
                                  if (targetVoice) {
                                    utterance.voice = targetVoice;
                                  } else if (fallbackVoice) {
                                    utterance.voice = fallbackVoice;
                                  }
                                  utterance.onstart = () => setIsPlaying(true);
                                  utterance.onend = () => setIsPlaying(false);
                                  utterance.onerror = () => setIsPlaying(false);
                                  window.speechSynthesis.speak(utterance);
                                }, 150);
                              }
                            }}
                            className={`px-2.5 py-1 text-sm sm:text-base font-black rounded-lg border-2 transition-all cursor-pointer ${
                              speechSpeed === speed.val
                                ? "bg-[#D84315] text-white border-[#1E1E1E]"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            {speed.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Speech Button */}
                    <button
                      id="modal-tts-button"
                      onClick={speak}
                      className={`flex items-center gap-2.5 px-6 py-4 sm:py-5 rounded-2xl border-4 border-[#1E1E1E] text-xl sm:text-2xl font-black shadow-[5px_5px_0_#1E1E1E] transition-all transform hover:scale-102 active:translate-y-1 cursor-pointer select-none ${
                        isPlaying
                          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                          : "bg-[#D84315] hover:bg-[#FF5722] text-white"
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-6 h-6 fill-current stroke-[3]" />
                          停止朗讀
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-8 h-8 animate-bounce stroke-[3]" />
                          語音朗讀
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Nice visual sound waves when playing */}
                {isPlaying && (
                  <div className="flex justify-center items-center gap-1.5 mt-4">
                    <span className="text-base font-bold text-[#D84315] mr-2">正在為您語音播報：</span>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scaleY: [0.3, 1.3, 0.3],
                          backgroundColor: ["#D84315", "#FF5722", "#D84315"],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                        className="w-1.5 h-6 rounded-full bg-[#D84315] origin-center"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Text Size Controls for High Visibility */}
              <div className="w-full flex items-center justify-between mb-5 p-4 bg-white/70 border-2 border-gray-300 rounded-2xl">
                <span className="text-lg sm:text-xl font-black text-gray-700 flex items-center gap-1.5">
                  🔎 字體放大調整：
                </span>
                <div className="flex gap-2">
                  {[
                    { type: "large", label: "大 🅰️" },
                    { type: "larger", label: "更大 🆎" },
                    { type: "giant", label: "巨大 🏆" },
                  ].map((sz) => (
                    <button
                      key={sz.type}
                      id={`font-size-${sz.type}`}
                      onClick={() => setFontSize(sz.type as any)}
                      className={`px-3 sm:px-4 py-2 text-base sm:text-lg font-black rounded-xl border-2 transition-all cursor-pointer ${
                        fontSize === sz.type
                          ? "bg-[#FFF3E0] text-[#D84315] border-[#D84315] scale-102"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-[#FFFDE7]"
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Central Instructional Rich Box */}
              <div className="w-full bg-white border-[6px] border-[#D84315] rounded-[36px] p-8 sm:p-10 shadow-[8px_8px_0_rgba(216,67,21,0.06)] min-h-[160px]">
                <p className={`${getFontSizeClass()} text-[#1E1E1E] whitespace-pre-line text-justify`}>
                  {item.fullTip}
                </p>
              </div>

              {/* Gentle Helper Banner */}
              <div className="mt-6 text-center text-gray-500 font-bold text-base sm:text-lg max-w-xl">
                💡 提醒：運動時請在穩固椅子上進行，並請安全第一。量血壓及吃藥前，可以先喝幾口溫水休息一下喔。
              </div>

            </div>

            {/* Closing Area */}
            <div className="p-6 border-t-4 border-dashed border-[#D84315] bg-[#FFF3E0] flex justify-center">
              <button
                id="modal-close-footer"
                onClick={onClose}
                className="w-full sm:w-2/3 py-4 sm:py-5 bg-[#D84315] hover:bg-[#BF360C] text-white font-extrabold text-2xl sm:text-3xl rounded-3xl border-4 border-[#1E1E1E] shadow-[5px_5px_0_#1E1E1E] active:translate-y-1 transition-all cursor-pointer flex justify-center items-center gap-2 select-none"
              >
                我了解了，關閉此視窗
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
