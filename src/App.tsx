import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dumbbell, 
  Utensils, 
  Sparkles, 
  Clock, 
  Heart, 
  Volume2, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { INSTRUCTION_CATEGORIES, InstructionItem, CategoryGroup, getBestVoice } from "./types";
import InstructionCard from "./components/InstructionCard";
import DetailModal from "./components/DetailModal";
import WeatherWidget from "./components/WeatherWidget";
import CookingSection from "./components/CookingSection";

const WELLNESS_TIPS_MANDARIN = [
  "多喝溫水能讓喉嚨更舒服，還能促進身體排毒喔！",
  "起步前可以先踩穩地板，慢慢站起來，防跌小祕訣！",
  "每次用餐細嚼慢嚥，不僅能嚐出食物美味，腸胃也更好吸收！",
  "每天做做十指握拳操，能保持手指靈活，活動腦部筋骨！",
  "高於心臟的伸展配合深呼吸，能讓心情像曬太陽一樣暖烘烘！",
  "血壓計記得放在桌面上，每天早晚定時測量，是愛護自己最好的方式！"
];

const WELLNESS_TIPS_CANTONESE = [
  "多飲暖水能等喉嚨更舒暢，仲能促進人體排毒排汗㗎！",
  "落床前可以先踩穩地板，慢慢企起身，預防跌倒小秘笈！",
  "餐餐食飯都慢慢咬慢慢吞，不但能食出味道鮮美，腸胃仲容易吸收！",
  "每日郁下手指開合拳頭，能令手指關節靈活，仲能鍛鍊大腦！",
  "雙手舉高過膊頭伸展並配合深呼吸，心情會像曬太陽咁暖洋洋！",
  "血壓計記得放喺枱面，每日早晚定時量血壓，係錫自己最好嘅方式！"
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("exercise");
  const [activeItem, setActiveItem] = useState<InstructionItem | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWelcomeSpeaking, setIsWelcomeSpeaking] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [voiceLang, setVoiceLang] = useState<"zh-HK" | "zh-TW">("zh-HK"); // Default to Cantonese (廣東話)

  const actionHeaderRef = useRef<HTMLDivElement>(null);

  const isHK = voiceLang === "zh-HK";

  // 智能獲取跟隨長輩所在時區的實際時間
  const localTime = (() => {
    // 檢測時區偏移。若時區偏移量為 0（常見於 AI Studio 測試沙盒 iframe），我們自動切換到 GMT+8 (香港/台灣時區)
    // 這樣能保證長輩看到的是此時此刻他們身處的時區時間，以及獲取精準的時段問候
    if (currentTime.getTimezoneOffset() === 0) {
      return new Date(currentTime.getTime() + 8 * 60 * 60 * 1000);
    }
    return currentTime;
  })();

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Warm up voices on mount (crucial for Safari/Chrome async voices loading)
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  // Cycle wellness tips every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % WELLNESS_TIPS_MANDARIN.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Format date and time beautifully in Traditional Chinese
  const formatChineseDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return localTime.toLocaleDateString(isHK ? "zh-HK" : "zh-TW", options);
  };

  const formatChineseTime = () => {
    const hour = localTime.getHours();
    const min = localTime.getMinutes();
    const sec = localTime.getSeconds();
    const totalMins = hour * 60 + min;

    let period = isHK ? "夜晚" : "夜晚";
    if (totalMins >= 1 && totalMins <= 180) {
      period = isHK ? "深夜" : "深夜";
    } else if (totalMins > 180 && totalMins < 360) {
      period = isHK ? "凌晨" : "凌晨";
    } else if (totalMins >= 360 && totalMins <= 420) {
      period = isHK ? "清晨" : "清晨";
    } else if (totalMins > 420 && totalMins < 720) {
      period = isHK ? "上午" : "上午";
    } else if (totalMins >= 720 && totalMins <= 1080) {
      period = isHK ? "下午" : "下午";
    } else if (totalMins > 1080 && totalMins <= 1200) {
      period = isHK ? "傍晚" : "傍晚";
    } else {
      period = isHK ? "夜晚" : "夜晚";
    }

    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;

    const formattedHour = String(displayHour).padStart(2, "0");
    const formattedMin = String(min).padStart(2, "0");
    const formattedSec = String(sec).padStart(2, "0");

    return `${period} ${formattedHour}:${formattedMin}:${formattedSec}`;
  };

  // Greeting helper based on exact user-defined intervals (每6小時劃分及特定精準區間)
  const getGreetingMessage = () => {
    const hour = localTime.getHours();
    const min = localTime.getMinutes();
    const totalMins = hour * 60 + min;

    // 00:01 - 03:00 (1 到 180 分鐘)
    if (totalMins >= 1 && totalMins <= 180) {
      return isHK 
        ? "🌌 親愛嘅長輩，依家係【深夜】時分。夜深人靜，如果你仲未瞓，起步要做足安全，早啲休息，小心受涼。"
        : "🌌 親愛的長輩，現在是【深夜】時分。夜深了，四周安寧。如您還沒入睡，請小心起步，早點休息，小心著涼。";
    } 
    // 03:01 - 05:59 (181 到 359 分鐘，填補用戶 181 到凌晨六點之間的區間)
    else if (totalMins > 180 && totalMins < 360) {
      return isHK
        ? "🕯️ 親愛嘅長輩，依家係【凌晨】時分。呢個時候係深度睡眠同養生嘅最好時間，祝你瞓個安穩好夢。"
        : "🕯️ 親愛的長輩，現在是【凌晨】時分。此時是深度安睡與養護的最佳時刻，祝您睡得香甜，擁有安穩的美夢。";
    } 
    // 06:00 - 07:00 (360 到 420 分鐘)
    else if (totalMins >= 360 && totalMins <= 420) {
      return isHK
        ? "🌄 親愛嘅長輩，依家係【清晨】時分。早晨好！落床前請先喺床邊坐多一分鐘先企身，飲杯暖水溫潤喉嚨。"
        : "🌄 親愛的長輩，現在是【清晨】時分。清晨好！請在床邊靜坐一分鐘再站起，喝杯溫水潤喉，放鬆身心。";
    } 
    // 07:01 - 11:59 (421 到 719 分鐘)
    else if (totalMins > 420 && totalMins < 720) {
      return isHK
        ? "☀️ 親愛嘅長輩，依家係【上午】時分。朝早好！今日太陽暖烘烘，一齊活動下關節、鬆下筋骨、伸展下雙手。"
        : "☀️ 親愛的長輩，現在是【上午】時分。上午好！太陽暖洋洋的，活動活動筋骨，伸展伸展雙手。";
    } 
    // 12:00 - 18:00 (720 到 1080 分鐘)
    else if (totalMins >= 720 && totalMins <= 1080) {
      return isHK
        ? "🧉 親愛嘅長輩，依家係【下午】時分。下午好！放鬆餐後嘅舒暖時光。飮杯暖茶，放鬆背脊同大腿，人更醒神。"
        : "🧉 親愛的長輩，現在是【下午】時分。下午好！放鬆的餐後舒暢時光。喝杯溫茶，放鬆背腿，人更精神。";
    } 
    // 18:01 - 20:00 (1081 到 1200 分鐘)
    else if (totalMins > 1080 && totalMins <= 1200) {
      return isHK
        ? "🌆 親愛嘅長輩，依家係【傍晚】時分。傍晚好！一齊做下手指操，準備享用軟腍、好咬又營養嘅晚餐囉。"
        : "🌆 親愛的長輩，現在是【傍晚】時分。傍晚好！做做手指操，準備享用美味營養、軟爛易嚼的晚餐囉。";
    } 
    // 20:01 - 00:00 (1201 分鐘到 1440 也就是 24小時，包含 00:00)
    else {
      return isHK
        ? "🌙 親愛嘅長輩，依家係【夜晚】時分。夜色好！辛苦咗一日，記住準時食藥，用暖水浸下腳，瞓個香甜好夢。"
        : "🌙 親愛的長輩，現在是【夜晚】時分。夜晚好！辛苦了一天，記得定時服藥，熱水泡腳睡個舒服的好覺。";
    }
  };

  // Speak welcome message helper
  const speakWelcome = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isWelcomeSpeaking) {
      window.speechSynthesis.cancel();
      setIsWelcomeSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Generate text including general instruction
    const plainGreeting = getGreetingMessage().replace(/[^\u4e00-\u9fa5，！。？【】]/g, "");
    const extraInstructionsMessage = voiceLang === "zh-HK"
      ? "。依個程式已經為你配置好超大字形同親近粵語。請撳下面一塊卡片睇詳細步驟，等我為你廣東話語音朗讀。"
      : "。本程式已為您配置超大字體與貼心國語。請點擊下方的任何一項卡片，即可查看詳細指示並為您語音朗讀喔。";
    
    const utterance = new SpeechSynthesisUtterance(plainGreeting + extraInstructionsMessage);
    utterance.rate = 0.82; // Slower cadence for clearer listening

    utterance.onstart = () => setIsWelcomeSpeaking(true);
    utterance.onend = () => setIsWelcomeSpeaking(false);
    utterance.onerror = () => setIsWelcomeSpeaking(false);

    // Try finding nice Voice
    const voices = window.speechSynthesis.getVoices();
    const bestVoice = getBestVoice(voices, voiceLang);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = voiceLang === "zh-TW" ? "zh-CN" : "zh-HK";
    }

    window.speechSynthesis.speak(utterance);
  };

  const activeCategoryData = INSTRUCTION_CATEGORIES.find(
    (cat) => cat.id === selectedCategory
  ) || INSTRUCTION_CATEGORIES[0];

  const activeCategoryName = isHK ? (activeCategoryData.nameCantonese || activeCategoryData.name) : activeCategoryData.name;
  const activeCategoryDescription = isHK ? (activeCategoryData.descriptionCantonese || activeCategoryData.description) : activeCategoryData.description;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "dumbbell":
        return <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10" />;
      case "utensils":
        return <Utensils className="w-8 h-8 sm:w-10 sm:h-10" />;
      case "sparkles":
        return <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />;
      default:
        return <Heart className="w-8 h-8 sm:w-10 sm:h-10" />;
    }
  };

  const currentTips = isHK ? WELLNESS_TIPS_CANTONESE : WELLNESS_TIPS_MANDARIN;

  return (
    <div className="relative min-h-screen bg-[#FFF8E1] text-[#1E1E1E] font-sans flex flex-col antialiased pb-12 selection:bg-[#FBE9E7] selection:text-[#D84315] select-text border-t-[20px] border-[#D84315]">
      
      {/* Upper Warm Header Decorator Bar */}
      <div className="bg-[#D84315] text-white py-2.5 px-6 flex justify-between items-center text-sm sm:text-base font-black tracking-wider border-b-4 border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 fill-current animate-pulse text-yellow-300" />
          <span>{isHK ? "長輩守護 ・ 溫馨關懷提醒板" : "孝心陪伴 ・ 溫馨守護板"}</span>
        </div>
        <div className="hidden lg:block lg:mr-[220px]">
          <span>{isHK ? "超大字體 ✦ 高對比 ✦ 貼心廣東話及國語" : "大字版 ✦ 高對比 ✦ 語音播報輔助"}</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        
        {/* Top Interactive Greeting & Time Block */}
        <section className="bg-white border-[6px] border-[#D84315] rounded-[48px] p-6 sm:p-8 shadow-[12px_12px_0px_rgba(216,67,21,0.18)] mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Portion: Warm Greetings */}
            <div className="flex-1">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="bg-[#FFF3E0] text-[#D84315] px-5 py-2 rounded-2xl text-xl sm:text-2xl font-black border-2 border-[#D84315]/30 font-sans">
                  {isHK ? "💖 每日貼心祝福" : "💖 每日祝福"}
                </span>
                
                {/* Voice Selection Toolbar */}
                <div className="flex items-center gap-2 bg-[#FFF8E1] p-1.5 rounded-2xl border-2 border-[#D84315]/20">
                  <span className="text-sm sm:text-base font-black text-gray-700 ml-1">{isHK ? "🗣️ 語言：" : "🗣️ 語言："}</span>
                  <button
                    id="lang-cantonese"
                    onClick={() => {
                      setVoiceLang("zh-HK");
                      if (isWelcomeSpeaking) {
                        window.speechSynthesis.cancel();
                        setIsWelcomeSpeaking(false);
                      }
                    }}
                    className={`px-3 py-1.5 text-sm sm:text-base font-black rounded-xl border-2 transition-all cursor-pointer ${
                      voiceLang === "zh-HK"
                        ? "bg-[#D84315] text-white border-[#1E1E1E]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    🇭🇰 廣東話
                  </button>
                  <button
                    id="lang-mandarin"
                    onClick={() => {
                      setVoiceLang("zh-TW");
                      if (isWelcomeSpeaking) {
                        window.speechSynthesis.cancel();
                        setIsWelcomeSpeaking(false);
                      }
                    }}
                    className={`px-3 py-1.5 text-sm sm:text-base font-black rounded-xl border-2 transition-all cursor-pointer ${
                      voiceLang === "zh-TW"
                        ? "bg-[#D84315] text-white border-[#1E1E1E]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    🇹🇼 國語
                  </button>
                </div>
                
                {/* TTS helper for Welcome Greeting */}
                <button
                  id="speak-welcome-btn"
                  onClick={speakWelcome}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-3 border-[#1E1E1E] font-black text-base sm:text-lg cursor-pointer transform active:scale-95 transition-all select-none shadow-[4px_4px_0_#1E1E1E] ${
                    isWelcomeSpeaking 
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                      : "bg-[#FFF8E1] hover:bg-[#FFF3E0] text-[#D84315] hover:text-[#BF360C]"
                  }`}
                  aria-label="語音朗讀今日祝福"
                >
                  <Volume2 className="w-5 h-5 stroke-[3]" />
                  {isWelcomeSpeaking ? (isHK ? "停止" : "停止") : (isHK ? "聽語音 🔊" : "聽語音 🔊")}
                </button>
              </div>
              
              <h1 className="text-3xl sm:text-4.5xl font-black text-[#D84315] mt-4 leading-snug tracking-tight">
                {getGreetingMessage()}
              </h1>
            </div>

            {/* Right Portion: Huge Clock Widget */}
            <div className="bg-[#FFF8E1] border-[4px] border-[#D84315] rounded-[36px] p-6 flex flex-col items-center justify-center min-w-[310px] shrink-0 shadow-[8px_8px_0px_rgba(216,67,21,0.12)]">
              <div className="flex items-center gap-2 text-[#5D4037] text-lg sm:text-xl font-black mb-1.5">
                <Calendar className="w-6 h-6 text-[#D84315]" />
                <span>{formatChineseDate()}</span>
              </div>
              <div className="flex items-center gap-2 text-4xl sm:text-5xl font-mono font-black text-[#D84315] tracking-wide mt-1.5">
                <Clock className="w-9 h-9 shrink-0 text-[#D84315] animate-spin-slow" style={{ animationDuration: '20s' }} />
                <span>{formatChineseTime()}</span>
              </div>
            </div>

          </div>
        </section>

        {/* Dynamic Tip of the Day - Auto cycling */}
        <section className="bg-white border-[6px] border-[#D84315] rounded-[40px] p-6 mb-8 sm:mb-10 flex items-start gap-4 shadow-[12px_12px_0px_rgba(216,67,21,0.15)]">
          <AlertCircle className="w-8 h-8 text-[#D84315] shrink-0 mt-1 stroke-[3]" />
          <div className="flex-1 min-w-0">
            <span className="text-lg font-black text-[#D84315] tracking-wider uppercase block">
              {isHK ? "💡 溫馨養生生活指南" : "💡 溫馨養生生活指南"}
            </span>
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-xl sm:text-2xl font-bold text-[#5D4037] mt-1.5 leading-relaxed"
              >
                {currentTips[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </section>

        {/* Tab Selection: Catgory Switches */}
        <section className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center">
            {INSTRUCTION_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const catName = isHK ? (cat.nameCantonese || cat.name) : cat.name;
              return (
                <button
                  key={cat.id}
                  id={`tab-btn-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setTimeout(() => {
                      actionHeaderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 60);
                  }}
                  className={`flex items-center justify-center gap-4 py-5 px-8 text-2xl sm:text-3.5xl font-black rounded-[36px] border-[6px] border-[#1E1E1E] transition-all transform hover:scale-102 active:translate-y-1 cursor-pointer select-none shadow-[8px_8px_0px_#1E1E1E] ${
                    isActive
                      ? "bg-[#D84315] text-white"
                      : "bg-white hover:bg-orange-50 text-[#1E1E1E]"
                  }`}
                  style={isActive ? { borderColor: '#1E1E1E' } : {}}
                >
                  <span className="shrink-0">
                    {getCategoryIcon(cat.icon)}
                  </span>
                  <span>{catName}</span>
                </button>
              );
            })}
          </div>
          
          {/* Subtext explaining selected scenario */}
          {selectedCategory !== "cooking" && (
            <div className="text-center mt-6" ref={actionHeaderRef}>
              <p className="text-xl sm:text-2xl text-[#5D4037] font-bold">
                {isHK ? (
                  <>
                    👉 當前場景：<span className="text-[#D84315] font-black">{activeCategoryDescription}</span>。撳下面嘅卡片睇詳細步驟！
                  </>
                ) : (
                  <>
                    👉 當前場景：<span className="text-[#D84315] font-black">{activeCategoryDescription}</span>。點擊下方卡片有詳細步驟哦！
                  </>
                )}
              </p>
            </div>
          )}
        </section>

        {/* Responsive 2x3 Grid of Instruction Cards */}
        <section className="mb-10">
          {selectedCategory === "cooking" ? (
            <CookingSection voiceLang={voiceLang} />
          ) : (
            <motion.div 
              id="instruction-grid"
              key={selectedCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
            >
              {activeCategoryData.items.map((item) => (
                <InstructionCard
                  key={item.id}
                  item={item}
                  voiceLang={voiceLang}
                  onClick={() => setActiveItem(item)}
                />
              ))}
            </motion.div>
          )}
        </section>

        {/* Detailed Modal popup */}
        <DetailModal
          item={activeItem || activeCategoryData.items[0]}
          isOpen={activeItem !== null}
          onClose={() => setActiveItem(null)}
          voiceLang={voiceLang}
        />

        {/* Footer info or disclaimer */}
        <footer className="mt-16 text-center p-8 bg-white border-[6px] border-[#D84315] rounded-[40px] shadow-[12px_12px_0_rgba(216,67,21,0.15)]">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-3xl font-black text-[#D84315] flex items-center gap-2 select-none">
              👵 以愛為名，貼心陪伴 👴
            </span>
            <p className="text-lg sm:text-xl text-[#5D4037] font-bold max-w-4xl leading-relaxed">
              {isHK 
                ? "本工具專為長輩嘅日常生活同家庭防護設計。我哋將操作界面放大、去走繁瑣設定，並內建高品質中文發音，就算視力唔好、手腳微震、或者唔熟電腦，都可以在簡單操作入面聽見親切嘅叮嚀同問候。"
                : "本工具專為長輩的日常生活與家庭防護設計。我們將操作介面放大、去除繁瑣設定，並內建高品質中文發音，即使視力不佳、手腳微顫、或不熟電腦，也能在簡單的操作中聽見叮嚀與問候。"
              }
            </p>
            <div className="flex justify-center items-center gap-4 mt-2">
              <div className="h-4 w-16 bg-[#D84315] rounded-full"></div>
              <div className="h-4 w-4 bg-[#D84315] opacity-20 rounded-full"></div>
              <div className="h-4 w-4 bg-[#D84315] opacity-20 rounded-full"></div>
            </div>
            <span className="text-gray-400 font-bold text-base mt-2">
              © 2026 長輩關懷溫馨提醒板 ・ 祝全天下長輩歲歲平安、身體康健！
            </span>
          </div>
        </footer>

      </main>

      {/* Real-time Weather Tips Overlay Widget */}
      <WeatherWidget voiceLang={voiceLang} />
    </div>
  );
}
