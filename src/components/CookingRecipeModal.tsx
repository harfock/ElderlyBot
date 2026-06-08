import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, X, Clock, Flame, ShieldAlert, Sparkles, Scale } from "lucide-react";
import { Recipe, CookingMethod } from "../cookingData";
import { getBestVoice } from "../types";

interface CookingRecipeModalProps {
  recipe: Recipe | null;
  method: CookingMethod | null;
  isOpen: boolean;
  onClose: () => void;
  voiceLang: "zh-HK" | "zh-TW";
}

export default function CookingRecipeModal({
  recipe,
  method,
  isOpen,
  onClose,
  voiceLang = "zh-HK"
}: CookingRecipeModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState<"large" | "larger" | "giant">("larger");
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.8); // Slower for elder clarity
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isHK = voiceLang === "zh-HK";

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

  // Cancel voice reading when modal is closed
  useEffect(() => {
    if (!isOpen && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const formatText = (text: string) => {
    if (!text) return "";
    if (isHK) {
      return text
        .replace(/1\/2/g, "2份1")
        .replace(/1\/4/g, "4份1")
        .replace(/1\/3/g, "3份1")
        .replace(/3\/4/g, "4份3");
    }
    return text;
  };

  if (!recipe || !method) return null;

  const title = isHK ? (recipe.titleCantonese || recipe.title) : recipe.title;
  const steps = isHK ? recipe.stepsCantonese : recipe.steps;
  const voiceText = isHK ? (recipe.voiceTextCantonese || recipe.voiceText) : recipe.voiceText;
  const nutritionTips = isHK 
    ? (recipe.nutritionCantonese || recipe.nutrition)
    : recipe.nutrition;

  const speak = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    synthRef.current.cancel();

    // Use cooking specific voice overview
    const textToSpeakBase = voiceText || `${title}。製作步驟如下：${steps.join("。")}`;
    const textToSpeak = formatText(textToSpeakBase);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    utterance.rate = speechSpeed;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.error("Recipe Speech Error", e);
      setIsPlaying(false);
    };

    const voices = synthRef.current.getVoices();
    const bestVoice = getBestVoice(voices, voiceLang);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = voiceLang === "zh-TW" ? "zh-CN" : "zh-HK";
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
        return "text-xl sm:text-2xl leading-relaxed";
      case "larger":
        return "text-2xl sm:text-3xl leading-relaxed font-bold";
      case "giant":
        return "text-3xl sm:text-4xl leading-loose font-extrabold";
    }
  };

  // Translations
  const closeBtnText = isHK ? "關閉食譜" : "關閉食譜";
  const readHeader = isHK ? "🔊 廣東話廚藝語音教學" : "🔊 語音烹飪廣播";
  const readSubtext = isHK 
    ? "睇得辛苦？點擊右邊橙色極大按鈕，等我為你廣東話講解煮法！" 
    : "看字吃力嗎？點擊右側橘紅色巨大按鈕，即可為您語音朗讀步驟！";
  
  const speedLabel = isHK ? "慢啲定快啲：" : "語速調校：";
  const speedSlantMin = isHK ? "慢啲 🐢" : "慢速 🐢";
  const speedSlantMid = isHK ? "中等 🚶" : "適中 🚶";
  const speedSlantMax = isHK ? "快啲 ⚡" : "快速 ⚡";
  
  const speakBtnPlay = isHK ? "聽廣播" : "播放語音";
  const speakBtnStop = isHK ? "停止讀" : "停止播放";
  const soundWaveText = isHK ? "正在播報：" : "正在為您語音播報：";
  
  const fontSizeLabel = isHK ? "字體大細調整：" : "字體大小調整：";
  const fontSizeLg = isHK ? "大 🅰️" : "大 🅰️";
  const fontSizeXl = isHK ? "更大 🆎" : "更大 🆎";
  const fontSizeXxl = isHK ? "巨大 🏆" : "巨大 🏆";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-3">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="relative bg-[#FFF8E1] w-full max-w-4xl max-h-[94vh] overflow-y-auto border-[6px] border-[#D84315] rounded-[48px] shadow-[12px_12px_0px_rgba(216,67,21,0.25)] flex flex-col z-10"
          >
            {/* Header banner */}
            <div className="p-6 sm:p-8 border-b-[6px] border-dashed border-[#D84315] bg-[#FFF3E0] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl select-none" role="img" aria-label="emoji">
                  {recipe.emoji}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#D84315] text-white text-sm sm:text-base font-black px-2.5 py-0.5 rounded-full select-none">
                      {isHK ? method.nameCantonese : method.name}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-yellow-200 select-none">
                      <Clock className="w-3.5 h-3.5" />
                      {recipe.prepTime}
                    </span>
                  </div>
                  <h2 className="text-3.5xl sm:text-4.5xl font-black text-[#D84315] mt-1 tracking-tight leading-none">
                    {title}
                  </h2>
                </div>
              </div>
              
              <button
                id="close-recipe-x"
                onClick={onClose}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white hover:bg-orange-50 border-4 border-[#1E1E1E] flex items-center justify-center cursor-pointer shadow-[4px_4px_0_#1E1E1E] active:translate-y-0.5 transform transition-all select-none"
                aria-label="Close"
              >
                <X className="w-7 h-7 stroke-[3.5] text-red-600" />
              </button>
            </div>

            {/* TTS Broadcast Control Panel */}
            <div className="p-5 sm:p-6 bg-orange-50 border-b-[4px] border-[#D84315]/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl sm:text-2.5xl font-black text-[#D84315] flex items-center gap-2">
                  <span>{readHeader}</span>
                </h3>
                <p className="text-lg sm:text-xl text-[#5D4037] font-bold mt-1">
                  {readSubtext}
                </p>
                
                {/* Speed Controls */}
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-gray-700">{speedLabel}</span>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#D84315]/20">
                    <button
                      id="speed-recipe-slow"
                      onClick={() => setSpeechSpeed(0.65)}
                      className={`px-2.5 py-1 text-sm sm:text-base font-black rounded-lg transition-all cursor-pointer ${
                        speechSpeed === 0.65 ? "bg-[#D84315] text-white" : "text-gray-600 hover:bg-orange-50"
                      }`}
                    >
                      {speedSlantMin}
                    </button>
                    <button
                      id="speed-recipe-mid"
                      onClick={() => setSpeechSpeed(0.8)}
                      className={`px-2.5 py-1 text-sm sm:text-base font-black rounded-lg transition-all cursor-pointer ${
                        speechSpeed === 0.8 ? "bg-[#D84315] text-white" : "text-gray-600 hover:bg-orange-50"
                      }`}
                    >
                      {speedSlantMid}
                    </button>
                    <button
                      id="speed-recipe-fast"
                      onClick={() => setSpeechSpeed(1.0)}
                      className={`px-2.5 py-1 text-sm sm:text-base font-black rounded-lg transition-all cursor-pointer ${
                        speechSpeed === 1.0 ? "bg-[#D84315] text-white" : "text-gray-600 hover:bg-orange-50"
                      }`}
                    >
                      {speedSlantMax}
                    </button>
                  </div>
                </div>
              </div>

              {/* Big speak button */}
              <button
                id="recipe-speak-btn"
                onClick={speak}
                className={`flex items-center justify-center gap-3 w-full md:w-auto px-8 py-5 rounded-[28px] border-[5px] border-[#1E1E1E] font-black text-2xl sm:text-3xl cursor-pointer transform active:scale-95 transition-all select-none shadow-[6px_6px_0_#1E1E1E] ${
                  isPlaying
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : "bg-[#D84315] hover:bg-[#BF360C] text-white"
                }`}
              >
                <Volume2 className="w-7 h-7 stroke-[3.5]" />
                <span>{isPlaying ? speakBtnStop : speakBtnPlay}</span>
              </button>
            </div>

            {/* Speaking Wave Bar Indicator */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-yellow-100 border-b-[4px] border-[#D84315]/20 py-3.5 px-6 flex items-center gap-4 text-orange-850 font-black"
                >
                  <span className="text-lg sm:text-xl shrink-0 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block animate-ping"></span>
                    {soundWaveText}
                  </span>
                  <div className="overflow-x-auto flex-1 whitespace-nowrap text-xl sm:text-2xl font-black text-red-700 tracking-wide py-1 scrollbar-none select-none">
                    {title} ✦ {isHK ? "請一邊睇食譜一邊聽解說。祝你煮得健康美味、胃口大開！" : "請一邊看食譜一邊聽解說。祝您煮得健康美味、吃得香甜健康！"} ✦ {steps.map(s => formatText(s)).join(" ➔ ")}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Font Control Bar */}
            <div className="px-6 sm:px-8 py-4 bg-white/70 border-b-2 border-orange-100 flex flex-wrap items-center justify-between gap-4 select-none">
              <div className="flex items-center gap-2">
                <span className="bg-orange-100 ring-2 ring-[#D84315]/10 text-[#D84315] text-sm sm:text-base font-black px-3 py-1 rounded-xl">
                  {isHK ? "👵 專為長輩設計大字版" : "👵 專為長輩設計大字版"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base sm:text-lg font-black text-[#5D4037]">{fontSizeLabel}</span>
                <div className="flex items-center border-[3px] border-[#1E1E1E] rounded-xl overflow-hidden shadow-[2px_2px_0_#1E1E1E]">
                  <button
                    id="font-recipe-large"
                    onClick={() => setFontSize("large")}
                    className={`px-4 py-1.5 font-bold cursor-pointer transition-colors ${
                      fontSize === "large" ? "bg-[#1E1E1E] text-white" : "bg-white hover:bg-orange-50 text-gray-700"
                    }`}
                  >
                    {fontSizeLg}
                  </button>
                  <button
                    id="font-recipe-larger"
                    onClick={() => setFontSize("larger")}
                    className={`px-4 py-1.5 font-bold cursor-pointer transition-colors ${
                      fontSize === "larger" ? "bg-[#1E1E1E] text-white" : "bg-white hover:bg-orange-50 text-gray-700"
                    }`}
                  >
                    {fontSizeXl}
                  </button>
                  <button
                    id="font-recipe-giant"
                    onClick={() => setFontSize("giant")}
                    className={`px-4 py-1.5 font-bold cursor-pointer transition-colors ${
                      fontSize === "giant" ? "bg-[#1E1E1E] text-white" : "bg-white hover:bg-orange-50 text-gray-700"
                    }`}
                  >
                    {fontSizeXxl}
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Main Area */}
            <div className="p-6 sm:p-10 flex-1 flex flex-col gap-8">
              
              {/* Nutritional Overview Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {/* Calories card */}
                <div className="bg-white border-4 border-[#1E1E1E] rounded-[24px] p-4 flex items-center gap-3.5 shadow-[4px_4px_0_#1E1E1E]">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Flame className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-gray-400 block tracking-wider uppercase">
                      {isHK ? "估計卡路里" : "估計熱量"}
                    </span>
                    <span className="text-2xl sm:text-3.5xl font-mono font-black text-[#D84315] leading-none">
                      {recipe.calories} <span className="text-base sm:text-lg font-black text-gray-600">kcal</span>
                    </span>
                  </div>
                </div>

                {/* Fat card */}
                <div className="bg-white border-4 border-[#1E1E1E] rounded-[24px] p-4 flex items-center gap-3.5 shadow-[4px_4px_0_#1E1E1E]">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Scale className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-gray-400 block tracking-wider uppercase">
                      {isHK ? "估計脂肪含量" : "估計脂肪含量"}
                    </span>
                    <span className="text-2xl sm:text-3.5xl font-mono font-black text-orange-700 leading-none">
                      {recipe.fat} <span className="text-base sm:text-lg font-black text-gray-600">g 克</span>
                    </span>
                  </div>
                </div>

                {/* Healthy Seasoning standards guard */}
                <div className="sm:col-span-2 md:col-span-1 bg-green-50 border-4 border-[#1E1E1E] rounded-[24px] p-4 flex items-center gap-3.5 shadow-[4px_4px_0_#1E1E1E]">
                  <div className="w-12 h-12 bg-green-150 text-green-700 rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-emerald-600 block tracking-wider uppercase">
                      {isHK ? "🌿 老年人健康膳食" : "🌿 高齡低鈉少油推薦"}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-green-800 leading-none block mt-0.5">
                      {isHK ? "嚴控油鹽糖份量" : "嚴控油鹽糖份量"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Healthy Seasoning Details (Oil, Salt, Sugar) */}
              <div className="bg-[#FFF3E0] border-[4px] border-[#D84315] rounded-[32px] p-6 shadow-[6px_6px_0_rgba(216,67,21,0.1)]">
                <h4 className="text-xl sm:text-2xl font-black text-[#D84315] flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-6 h-6 text-red-650 shrink-0" />
                  <span>{isHK ? "⚠️ 家常健康控量：油。鹽。糖 建議份量" : "⚠️ 控油鹽糖健康標準說明"}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg font-bold text-[#5D4037]">
                  <div className="bg-white rounded-2xl p-3.5 border-2 border-orange-200">
                    <span className="text-[#D84315] font-black block text-base select-none">🧈 油份建議量</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#1E1E1E] block mt-1">{formatText(recipe.oil)}</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3.5 border-2 border-orange-200">
                    <span className="text-[#D84315] font-black block text-base select-none">🧂 鹽份建議量</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#1E1E1E] block mt-1">{formatText(recipe.salt)}</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3.5 border-2 border-orange-200">
                    <span className="text-[#D84315] font-black block text-base select-none">🍬 糖份建議量</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#1E1E1E] block mt-1">{formatText(recipe.sugar)}</span>
                  </div>
                </div>
              </div>

              {/* Doctor & Nutritionist Explanation Card */}
              {nutritionTips && nutritionTips.length > 0 && (
                <div id="recipe-nutrition-card" className="bg-emerald-50 border-[5px] border-emerald-600 rounded-[32px] p-6 sm:p-8 shadow-[6px_6px_0_rgba(16,185,129,0.15)]">
                  <h4 className="text-2xl sm:text-3xl font-black text-emerald-800 flex items-center gap-2.5 mb-5 select-none">
                    <span className="text-3xl sm:text-4xl">🧑‍⚕️</span>
                    <span>{isHK ? "營養師膳食健康全面解說" : "營養師膳食健康全面解說"}</span>
                  </h4>
                  <div className="flex flex-col gap-5">
                    {nutritionTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <span className="text-2xl select-none shrink-0 mt-1">🌿</span>
                        <p className={`text-emerald-950 font-black leading-loose ${getFontSizeClass()}`}>
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients Details */}
              <div>
                <h4 className="text-2xl sm:text-3.5xl font-black text-[#D84315] border-b-4 border-[#D84315]/10 pb-2 mb-4 flex items-center gap-2">
                  <span>🛒 {isHK ? "建議食材與分量" : "食材準備與分量"}</span>
                  <span className="text-base sm:text-lg font-black text-gray-500 normal-case ml-2">({isHK ? "2-3人份" : "2-3人份"})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recipe.ingredients.map((ing, i) => (
                    <div 
                      key={i}
                      className="bg-white border-[3px] border-[#1E1E1E] py-4 px-6 rounded-2xl flex items-center justify-between text-xl font-bold text-[#5D4037] shadow-[3px_3px_0_#1E1E1E]"
                    >
                      <span>{ing.name}</span>
                      <span className="bg-[#FFF8E1] text-[#D84315] font-black px-3.5 py-1 rounded-xl border border-orange-200">
                        {formatText(ing.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Cooking Steps */}
              <div>
                <h4 className="text-2xl sm:text-3.5xl font-black text-[#D84315] border-b-4 border-[#D84315]/10 pb-2 mb-4">
                  👩‍🍳 {isHK ? "超仔細製作步驟說明" : "詳細烹飪步驟流程"}
                </h4>
                <div className="flex flex-col gap-6">
                  {steps.map((step, idx) => (
                    <div 
                      key={idx}
                      className="bg-white border-[4px] border-[#1E1E1E] rounded-[28px] p-5 sm:p-6 shadow-[5px_5px_0_#1E1E1E] transition-all hover:bg-orange-50/20"
                    >
                      <div className="flex items-start gap-4">
                        <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#D84315] text-white flex items-center justify-center font-mono font-black text-xl sm:text-2xl shrink-0 mt-1 select-none">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className={`text-[#1E1E1E] leading-loose ${getFontSizeClass()}`}>
                            {formatText(step)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Footer Info Disclaimer Panel */}
            <div className="p-6 bg-[#FFF3E0] border-t-[6px] border-[#D84315] rounded-b-[42px] flex flex-col items-center gap-4 text-center">
              <p className="text-lg sm:text-xl text-[#5D4037] font-black max-w-2xl">
                {isHK 
                  ? "💡 溫馨煮食提醒：長輩下廚時請確保地板乾爽、著防滑鞋，點火開火時一定要注意安全！建議用慢火或者蒸，少油鹽、更健康！"
                  : "💡 溫馨烹飪提醒：長輩下廚請確保廚房防滑，注意開火用火安全！以蒸菜、水煮為主，少油少鹽，身體更具活力！"
                }
              </p>
              <button
                id="footer-close-recipe-btn"
                onClick={onClose}
                className="px-10 py-4.5 rounded-3xl bg-[#D84315] hover:bg-[#BF360C] text-white border-4 border-[#1E1E1E] font-black text-xl sm:text-2xl cursor-pointer shadow-[4px_4px_0_#1E1E1E] transform active:scale-95 transition-all select-none"
              >
                {closeBtnText}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
