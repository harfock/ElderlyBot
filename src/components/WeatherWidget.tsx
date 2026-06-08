import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Wind, 
  Thermometer, 
  Droplets, 
  MapPin, 
  RotateCw, 
  Volume2, 
  Square,
  X 
} from "lucide-react";
import { getBestVoice } from "../types";

interface WeatherWidgetProps {
  voiceLang: "zh-HK" | "zh-TW";
}

interface WeatherData {
  temp: number;
  apparentTemp: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  cityName: string;
}

// Fixed target coordinates as defaults or manual presets
const CITY_PRESETS = [
  { name: "香港特別行政區", label: "香港 🇭🇰", lat: 22.3193, lon: 114.1694 },
  { name: "深圳市", label: "深圳 🇨🇳", lat: 22.5431, lon: 114.0579 },
  { name: "東京都", label: "東京 🇯🇵", lat: 35.6762, lon: 139.6503 },
];

export default function WeatherWidget({ voiceLang }: WeatherWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0); // Default preset is Hong Kong (index 0)
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Custom coordinates state and GPS tracking variables for "自訂"
  const [customLat, setCustomLat] = useState("22.3193");
  const [customLon, setCustomLon] = useState("114.1694");
  const [customName, setCustomName] = useState("香港特別行政區");
  const [isGpsActive, setIsGpsActive] = useState(false);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isHK = voiceLang === "zh-HK";

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Map WMO codes to icons, labels and styles
  const getWeatherDetails = (code: number) => {
    switch (code) {
      case 0:
        return { text: "晴朗無雲", emoji: "☀️", color: "text-amber-500", icon: <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" style={{ animationDuration: "12s" }} /> };
      case 1:
        return { text: "大致天晴", emoji: "🌤️", color: "text-amber-400", icon: <Sun className="w-10 h-10 text-amber-400" /> };
      case 2:
        return { text: "部分時間有雲", emoji: "⛅", color: "text-yellow-500", icon: <Cloud className="w-10 h-10 text-yellow-500" /> };
      case 3:
        return { text: "密雲陰天", emoji: "☁️", color: "text-gray-400", icon: <Cloud className="w-10 h-10 text-gray-400" /> };
      case 45:
      case 48:
        return { text: "有霧或霧淞", emoji: "🌫️", color: "text-teal-400", icon: <Cloud className="w-10 h-10 text-teal-400 animate-pulse" /> };
      case 51:
      case 53:
      case 55:
        return { text: "毛毛細雨", emoji: "🌧️", color: "text-blue-300", icon: <CloudRain className="w-10 h-10 text-blue-300" /> };
      case 56:
      case 57:
        return { text: "凍毛毛雨", emoji: "🌧️", color: "text-purple-300", icon: <CloudRain className="w-10 h-10 text-purple-300" /> };
      case 61:
      case 63:
      case 65:
        return { text: "有下雨", emoji: "🌧️", color: "text-blue-500", icon: <CloudRain className="w-10 h-10 text-blue-500 animate-bounce-slow" /> };
      case 66:
      case 67:
        return { text: "下冷凍雨", emoji: "🌧️", color: "text-indigo-400", icon: <CloudRain className="w-10 h-10 text-indigo-400" /> };
      case 71:
      case 73:
      case 75:
      case 77:
        return { text: "降雪或雪中", emoji: "❄️", color: "text-sky-300", icon: <CloudSnow className="w-10 h-10 text-sky-300" /> };
      case 80:
      case 81:
      case 82:
        return { text: "時有陣雨", emoji: "🌧️", color: "text-blue-600", icon: <CloudRain className="w-10 h-10 text-blue-600 animate-bounce-slow" /> };
      case 95:
      case 96:
      case 99:
        return { text: "雷暴有雨", emoji: "⛈️", color: "text-purple-600", icon: <CloudLightning className="w-10 h-10 text-purple-600" /> };
      default:
        return { text: "天晴", emoji: "☀️", color: "text-amber-500", icon: <Sun className="w-10 h-10 text-amber-500" /> };
    }
  };

  // Generate highly personalized, empathetic elderly reminders based on weather details
  const getElderlyReminder = (w: WeatherData) => {
    const isCantonese = voiceLang === "zh-HK";
    
    // Cold weather
    if (w.apparentTemp < 16) {
      if (isCantonese) {
        return {
          title: "❄️ 禦寒保暖小提醒",
          content: `今日體感溫度好凍呀，得 ${w.apparentTemp.toFixed(1)}°C 左右。長者出門記住著返件羽絨或厚大衣，戴定帽、頸巾、同暖手套。喺屋企要定時飲多杯暖水，起步落床之前先喺床邊坐多一兩分鐘暖下身，預防凍天血管驟冷收縮，小心冷親！`
        };
      } else {
        return {
          title: "❄️ 禦寒防寒暖心管家",
          content: `今天體感溫度非常寒冷，只有 ${w.apparentTemp.toFixed(1)}°C 左右。提醒長輩外出請記得穿著羽絨或厚外套，戴好圍巾和保暖帽。多下床活動一下，並配一杯溫熱水，暖身防感冒。早晚起步前，先在床邊坐等一分鐘，防血壓急降頭暈喔！`
        };
      }
    }
    
    // Hot weather
    if (w.apparentTemp > 31) {
      if (isCantonese) {
        return {
          title: "🥵 酷熱防中暑提醒",
          content: `出面天氣非常之酷熱呀，體感溫度成 ${w.apparentTemp.toFixed(1)}°C！長者記住要多啲喺涼爽通風或者有冷氣嘅地方避暑。要少量多次定時飲暖水，就算唔覺得口渴都要飲兩啖。千企唔好喺中午太陽最猛烈嘅時候出門，多食生果補足水分，特別預防熱衰竭中暑！`
        };
      } else {
        return {
          title: "🥵 炎炎夏日防暑秘笈",
          content: `今天外頭體感溫度高達 ${w.apparentTemp.toFixed(1)}°C，十分炎熱喔！叮嚀長輩盡量在室內陰涼通風或吹冷氣的地方休息。定時喝溫熱開水補充水分，不要等口渴了才喝。中午烈日當頭切勿外出，保障心血管健康，防暑安心過夏！`
        };
      }
    }

    // Rainy weather
    if (w.precipitation > 0.4 || [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(w.weatherCode)) {
      if (isCantonese) {
        return {
          title: "☔ 雨天防跌滑小秘笈",
          content: `今日出面落緊雨同比較潮濕，路面非常濕滑。提醒長者盡量減少外出，特別要防避階磚地同階梯。如果一定要出去，一定要著返對防滑嘅鞋，帶好穩陣嘅雨傘或者柺杖支撐，慢慢行看清路面，小心跣親受傷，安全第一！`
        };
      } else {
        return {
          title: "☔ 陰雨連連防滑安全警報",
          content: `今天外頭正在降雨，地面和台階可能非常濕滑。叮嚀長輩儘量留在室內，減少外出。若必須出門，請穿上防滑底性能好的鞋子，撐著牢固的傘，最好有柺杖或家人在一旁攙扶陪同。行進時步步踩穩，小心別滑倒了！`
        };
      }
    }

    // Windy weather
    if (w.windSpeed > 18) {
      if (isCantonese) {
        return {
          title: "💨 強風防冷風吹頭提醒",
          content: `今日風大有涼意，風速達到每小時 ${w.windSpeed.toFixed(1)} 千米。出街記住著多件防風外套及戴帽，特別係防範冷風吹頭引起頭昏腦腦痛。行路個陣要避開重型廣告牌、盆栽等，企穩重心，安安心心。`
        };
      } else {
        return {
          title: "💨 迎風防風健康提示",
          content: `今天室外風速較快，達每小時 ${w.windSpeed.toFixed(1)} 公里。叮嚀長輩出門加一件防風薄夾克，配好帽子，不要讓涼風直吹後腦杓以免風寒偏頭痛。走路時也請遠離大看板、招牌，踏穩腳步，安全平穩！`
        };
      }
    }

    // Normal mild comfortable weather
    if (isCantonese) {
      return {
        title: "🍀 天氣溫和極佳提醒",
        content: `今日外面天色幾好呀，體感舒適有 ${w.apparentTemp.toFixed(1)}°C。非常推薦長者去附近公園或者大廈樓下曬下溫暖嘅太陽、活動下關節骨骼，或者向親友問候兩句。散步可以令你今晚瞓得更香甜，心情好、健康好！`
      };
    } else {
      return {
        title: "🍀 氣候宜人健康運動機緣",
        content: `今天外頭氣溫舒適，體感 ${w.apparentTemp.toFixed(1)}°C，天色非常和諧。特別推薦長輩可在防滑防曬的安全地方，如公園陰涼處、中庭走走散散步，伸展手腳關節、曬曬太陽，不僅有助骨鈣合成，心情也會像晴天一樣舒服有活力！`
      };
    }
  };

  // Main weather fetch implementation (supports IP, manual preset coordinates or exact GPS coordinates)
  const fetchWeather = async (forcePresetIndex?: number, customCoords?: { lat: number, lon: number, name: string }) => {
    setLoading(true);
    setError(null);
    setIsGpsActive(false);
    
    // Stop any speech playing
    stopSpeech();

    try {
      let lat = 22.3193; // default Hong Kong
      let lon = 114.1694;
      let city = isHK ? "香港" : "香港";

      if (customCoords) {
        lat = customCoords.lat;
        lon = customCoords.lon;
        city = customCoords.name;
        setSelectedPresetIndex(3); // index of "自訂" selection
      } else if (forcePresetIndex !== undefined && forcePresetIndex !== null) {
        // Switch to the preset selected by user
        if (forcePresetIndex === 3) {
          // If custom triggers but no coords, we fetch with current custom lat/lon states
          lat = parseFloat(customLat) || 22.3193;
          lon = parseFloat(customLon) || 114.1694;
          city = customName || (isHK ? "自訂地區" : "自订地区");
          setSelectedPresetIndex(3);
        } else {
          const preset = CITY_PRESETS[forcePresetIndex];
          if (preset) {
            lat = preset.lat;
            lon = preset.lon;
            city = preset.name;
            setSelectedPresetIndex(forcePresetIndex);
          }
        }
      } else {
        // Default when nothing is selected
        lat = 22.3193;
        lon = 114.1694;
        city = "香港";
        setSelectedPresetIndex(0);
      }

      // Fetch official Open-Meteo current forecast
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`
      );

      if (!weatherRes.ok) {
        throw new Error("Meteo servers error state");
      }

      const weatherData = await weatherRes.json();
      const current = weatherData.current;

      setWeather({
        temp: current.temperature_2m,
        apparentTemp: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        precipitation: current.precipitation,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        cityName: city
      });
    } catch (e: any) {
      console.error(e);
      setError(isHK ? "天氣伺服器解析失敗，請重新載入或手動選擇城市" : "天氣服務器加載失敗，請重試或手動選擇城市。");
    } finally {
      setLoading(false);
    }
  };

  // High-precision GPS Geolocation weather tracker down to small local neighborhoods / street sectors
  const fetchGpsSmallRegionWeather = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setError(isHK ? "抱歉，您當前的瀏覽器不支援高精度 GPS 定位服務。" : "抱歉，您當前的瀏覽器不支持高精度 GPS 定位服務。");
      return;
    }

    setLoading(true);
    setIsGpsActive(true);
    setError(null);
    stopSpeech();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        let localRegionName = isHK ? "您的定位區域" : "您的定位區域";

        try {
          // Ask Nominatim for a super-precise small localized section in traditional Chinese
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=${isHK ? "zh-HK" : "zh-TW"}`,
            {
              headers: {
                "User-Agent": "ElderlyCompanionAppWeather/1.0"
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.address) {
              const addr = data.address;
              // Extract the smallest region component available (village, suburb, neighborhood, district)
              const district = addr.suburb || addr.neighbourhood || addr.village || addr.quarter || addr.city_district || addr.district || addr.town || addr.city || "";
              const road = addr.road || "";
              if (district) {
                localRegionName = road ? `${district} ${road}` : district;
              } else if (data.display_name) {
                localRegionName = data.display_name.split(",").slice(0, 2).join(", ").trim();
              }
            }
          }
        } catch (e) {
          console.error("Nominatim reverse geocode error:", e);
        }

        // Apply back coordinates and load weather for this specific coordinates
        setCustomLat(lat.toFixed(4));
        setCustomLon(lon.toFixed(4));
        setCustomName(localRegionName);
        setSelectedPresetIndex(3);

        await fetchWeather(undefined, { lat, lon, name: localRegionName });
      },
      (geoError) => {
        console.error("GPS error details:", geoError);
        let msg = isHK 
          ? "無法取得 GPS 定位資訊，請確認是否已允許定位權限。" 
          : "無法取得 GPS 定位資訊，請確認是否已允許定位權限。";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = isHK 
            ? "🚫 位址存取被拒。請到瀏覽器設定允許「長者日常語音提示程式」存取定位，以自動探測當前小區天氣。" 
            : "🚫 定位權限被拒。請到瀏覽器設置允許存取定位，以自動探測當前小區天氣。";
        }
        setError(msg);
        setLoading(false);
        setIsGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Perform fetching on initialization (smart default loads Hong Kong, then background searches live region)
  useEffect(() => {
    // Quick render beautiful default
    fetchWeather(0);

    // Warmly request precise small-region GPS coordinates in the background automatically
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          let localRegionName = isHK ? "您的定位區域" : "您的定位區域";
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=${isHK ? "zh-HK" : "zh-TW"}`,
              { headers: { "User-Agent": "ElderlyCompanionAppWeather/1.0" } }
            );
            if (response.ok) {
              const data = await response.json();
              if (data && data.address) {
                const addr = data.address;
                const district = addr.suburb || addr.neighbourhood || addr.village || addr.quarter || addr.city_district || addr.district || addr.town || addr.city || "";
                const road = addr.road || "";
                if (district) {
                  localRegionName = road ? `${district} ${road}` : district;
                }
              }
            }
          } catch (e) {
            console.error(e);
          }
          setCustomLat(lat.toFixed(4));
          setCustomLon(lon.toFixed(4));
          setCustomName(localRegionName);
          setSelectedPresetIndex(3);
          fetchWeather(undefined, { lat, lon, name: localRegionName });
        },
        () => {
          // Stay on local Hong Kong default if they decline popup
          console.log("Startup GPS request was not approved, staying on default.");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    // Clean up TTS
    return () => stopSpeech();
  }, [voiceLang]);

  // TTS implementation
  const speakWeather = () => {
    if (!synthRef.current || !weather) return;

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    synthRef.current.cancel();

    const wDetails = getWeatherDetails(weather.weatherCode);
    const r = getElderlyReminder(weather);

    let prefixText = "";
    if (isHK) {
      prefixText = `長輩好！依家播報 ${weather.cityName} 嘅即時天氣狀況。目前溫度 ${weather.temp.toFixed(1)}度，體感溫度約 ${weather.apparentTemp.toFixed(1)}度。天氣狀況喺 ${wDetails.text}。濕度百分之 ${weather.humidity}。風速。每小時 ${weather.windSpeed.toFixed(1)} 千米。以下是今日貼心提醒：${r.content}`;
    } else {
      prefixText = `長輩您好！現在播報 ${weather.cityName} 的實時天氣。目前氣溫 ${weather.temp.toFixed(1)}度，體感溫度約 ${weather.apparentTemp.toFixed(1)}度。天氣為 ${wDetails.text}。濕度為百分之 ${weather.humidity}。風速。每小時 ${weather.windSpeed.toFixed(1)} 公里。以下是溫馨提示：${r.content}`;
    }

    // Replace signs to plain TTS-friendly text
    const cleanSpeechText = prefixText.replace(/[^\u4e00-\u9fa5，。！.％\d度、分/千米公里公里]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 0.80; // clear slow cadence for seniors

    const voices = synthRef.current.getVoices();
    const bestVoice = getBestVoice(voices, voiceLang);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = voiceLang === "zh-TW" ? "zh-CN" : "zh-HK";
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Floating Animated Weather Trigger Button centered on top right */}
      <motion.button
        id="floating-weather-btn"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-[50px] right-4 sm:right-6 md:right-8 z-30 flex items-center gap-1.5 px-4 py-3 bg-[#D84315] hover:bg-[#BF360C] text-white rounded-full border-4 border-[#1E1E1E] font-black text-sm sm:text-base pointer-events-auto cursor-pointer shadow-[3px_3px_0_#1E1E1E] select-none"
      >
        {weather ? (
          <span className="text-xl sm:text-2xl mr-0.5 inline-block shrink-0">
            {getWeatherDetails(weather.weatherCode).emoji}
          </span>
        ) : (
          <Sun className="w-5 h-5 animate-spin mr-0.5 text-yellow-300 stroke-[3]" />
        )}
        <span className="hidden sm:inline-block">
          {weather ? `${weather.temp.toFixed(0)}°C ${getWeatherDetails(weather.weatherCode).text}` : "加載氣候"}
        </span>
        <span className="bg-yellow-300 text-[#D84315] font-black text-xs px-2 py-0.5 rounded-full border border-orange-900 shrink-0">
          {isHK ? "天氣 Remind" : "天氣提示"}
        </span>
      </motion.button>

      {/* Main Flow Window Panel (Animate-In Modal) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-[#1E1E1E]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 z-50">
            
            {/* Modal Box */}
            <motion.div
              id="weather-flow-panel"
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full max-w-2xl bg-white border-[6px] border-[#D84315] rounded-[48px] overflow-hidden shadow-[16px_16px_0_rgba(216,67,21,0.25)] flex flex-col"
            >
              
              {/* Box Header */}
              <div className="bg-[#D84315] text-white px-6 sm:px-8 py-5 flex justify-between items-center border-b-4 border-[#1E1E1E]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">📈</span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight select-none">
                    {isHK ? "即時天氣與防摔養生叮嚀" : "即時天氣與適溫康健小提示"}
                  </h2>
                </div>
                <button
                  id="close-weather-panel"
                  onClick={() => {
                    setIsOpen(false);
                    stopSpeech();
                  }}
                  className="bg-[#FFF8E1] text-[#D84315] hover:bg-[#D84315] hover:text-white p-2.5 rounded-2xl border-3 border-[#1E1E1E] cursor-pointer transition-all hover:scale-105 active:translate-y-0.5"
                  aria-label="關閉彈出視窗"
                >
                  <X className="w-6 h-6 stroke-[3]" />
                </button>
              </div>

              {/* Scrollable Content Container */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[80vh] bg-amber-50/20 space-y-6">
                
                {/* Manual Preset City Switcher Row */}
                <div>
                  <h3 className="text-lg font-black text-gray-700 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-[#D84315]" />
                    <span>{isHK ? "📍 手動切換城市區域（長輩大字版）：" : "📍 手動切換城市區域（長輩大字版）："}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {CITY_PRESETS.map((preset, idx) => {
                      const isActive = selectedPresetIndex === idx;
                      return (
                        <button
                          key={preset.name}
                          onClick={() => fetchWeather(idx)}
                          className={`px-4 py-2.5 text-lg sm:text-xl font-black rounded-2xl border-3 transition-all cursor-pointer shadow-[3px_3px_0_rgba(0,0,0,0.1)] active:translate-y-0.5 ${
                            isActive
                              ? "bg-amber-100 border-[#D84315] text-[#D84315]"
                              : "bg-white border-gray-300 hover:bg-orange-50 text-gray-700"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}

                    {/* Custom Preset Switcher */}
                    <button
                      id="custom-gps-preset-btn"
                      onClick={() => {
                        setSelectedPresetIndex(3);
                        fetchGpsSmallRegionWeather();
                      }}
                      className={`px-4 py-2.5 text-lg sm:text-xl font-black rounded-2xl border-3 transition-all cursor-pointer shadow-[3px_3px_0_rgba(0,0,0,0.1)] active:translate-y-0.5 ${
                        selectedPresetIndex === 3
                          ? "bg-amber-100 border-[#D84315] text-[#D84315]"
                          : "bg-white border-gray-300 hover:bg-orange-50 text-gray-700"
                      }`}
                    >
                      自訂位置 🌍
                    </button>
                  </div>

                  {/* High Accuracy Custom GPS Section */}
                  {selectedPresetIndex === 3 && (
                    <div className="mt-4 p-5 bg-[#FFFDE8] border-3 border-[#D84315] rounded-[32px] space-y-4 shadow-sm animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-black text-gray-800 flex items-center gap-1.5">
                            <span>📡 自動定位</span>
                            <span className="bg-yellow-300 text-orange-950 text-xs px-2 py-0.5 rounded-full border border-orange-900">精密 GPS 小區定位</span>
                          </h4>
                          <p className="text-sm text-gray-600 font-bold mt-1 leading-relaxed">
                            {isHK
                              ? "系統會利用您裝置的高精度 GPS / Wi-Fi 定位，配合地圖數據反向譯出您居住的近鄰街道或地區里鄰名稱。"
                              : "系統會利用您設備的高精度 GPS / Wi-Fi 定位，配合地圖數據反向譯出您居住的近鄰街道或地區里鄰名稱。"
                            }
                          </p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={fetchGpsSmallRegionWeather}
                          className="px-4 py-2.5 bg-[#D84315] hover:bg-[#BF360C] text-white font-extrabold text-base rounded-2xl border-2 border-orange-950 flex items-center justify-center gap-1.5 transition-all select-none shadow-[3px_3px_0_#1E1E1E] cursor-pointer shrink-0"
                        >
                          <RotateCw className={`w-4 h-4 ${isGpsActive && loading ? "animate-spin" : ""}`} />
                          <span>{isHK ? "重測 GPS 定位" : "重测 GPS 定位"}</span>
                        </button>
                      </div>

                      {/* Manual backup settings for custom latitude and longitude */}
                      <div className="pt-3 border-t-2 border-dashed border-amber-200">
                        <p className="text-base font-black text-gray-700 mb-2">
                          ✍️ 手動輸入世界各地經緯度（備用）：
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-black text-gray-500 block mb-1">自訂城市 / 社區名稱</label>
                            <input
                              type="text"
                              value={customName}
                              onChange={(e) => setCustomName(e.target.value)}
                              placeholder="填寫名稱"
                              className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-xl text-base font-extrabold bg-white text-gray-850 outline-none focus:border-[#D84315]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-black text-gray-500 block mb-1">經度 Longitude (-180 至 180)</label>
                            <input
                              type="number"
                              step="any"
                              value={customLon}
                              onChange={(e) => setCustomLon(e.target.value)}
                              placeholder="例如 114.1694"
                              className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-xl text-base font-extrabold bg-white text-gray-850 outline-none focus:border-[#D84315]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-black text-gray-500 block mb-1">緯度 Latitude (-90 至 90)</label>
                            <input
                              type="number"
                              step="any"
                              value={customLat}
                              onChange={(e) => setCustomLat(e.target.value)}
                              placeholder="例如 22.3193"
                              className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-xl text-base font-extrabold bg-white text-gray-850 outline-none focus:border-[#D84315]"
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const latVal = parseFloat(customLat) || 22.3193;
                              const lonVal = parseFloat(customLon) || 114.1694;
                              fetchWeather(undefined, { lat: latVal, lon: lonVal, name: customName || "自訂區域" });
                            }}
                            className="bg-amber-100 text-[#D84315] hover:bg-[#FFF3E0] border-2 border-[#D84315] px-4 py-2 rounded-xl text-base font-black transition-all cursor-pointer shadow-[2px_2px_0_rgba(216,67,21,0.15)]"
                          >
                            💾 套用上述自訂數值
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Loading / Error / Content states */}
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-[#D84315] rounded-full animate-spin"></div>
                    <p className="text-xl sm:text-2xl text-gray-600 font-extrabold animate-pulse">
                      {isHK ? "🛜 正在更新最新氣象數據中，請稍候..." : "🛜 正在下載最即時氣候數據，請稍後..."}
                    </p>
                  </div>
                ) : error ? (
                  <div className="p-6 bg-red-100 border-2 border-red-400 rounded-3xl flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-lg font-black text-red-700">{error}</p>
                  </div>
                ) : weather ? (
                  <div className="space-y-6">
                    
                    {/* Primary Weather Details Card */}
                    <div className="bg-white border-[4px] border-[#D84315] rounded-[36px] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#FFF3E0] p-4 rounded-3xl border-2 border-orange-200 shrink-0">
                          {getWeatherDetails(weather.weatherCode).icon}
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-black text-blue-800 tracking-wider">
                            🏡 {weather.cityName}
                          </p>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-4xl sm:text-5xl font-mono font-black text-[#D84315]">
                              {weather.temp.toFixed(1)}
                            </span>
                            <span className="text-2xl font-black text-gray-600">°C</span>
                          </div>
                          <p className="text-lg sm:text-xl font-bold text-gray-600 mt-1">
                            {getWeatherDetails(weather.weatherCode).emoji} {getWeatherDetails(weather.weatherCode).text}
                          </p>
                        </div>
                      </div>

                      {/* Detail Indicators Grid */}
                      <div className="grid grid-cols-2 gap-4 w-full sm:w-auto border-t-2 sm:border-t-0 sm:border-l-2 border-gray-100 pt-4 sm:pt-0 sm:pl-6">
                        <div className="flex items-center gap-2 bg-orange-50/50 p-2.5 rounded-2xl">
                          <Thermometer className="w-6 h-6 text-[#D84315]" />
                          <div>
                            <span className="text-sm text-gray-500 font-bold block">{isHK ? "體感溫度" : "體感溫度"}</span>
                            <span className="text-lg font-black text-orange-950 font-mono">
                              {weather.apparentTemp.toFixed(1)}°C
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-2xl">
                          <Droplets className="w-6 h-6 text-blue-500" />
                          <div>
                            <span className="text-sm text-gray-500 font-bold block">{isHK ? "空氣濕度" : "環境濕度"}</span>
                            <span className="text-lg font-black text-blue-950 font-mono">
                              {weather.humidity}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-sky-50/50 p-2.5 rounded-2xl">
                          <Wind className="w-6 h-6 text-sky-500" />
                          <div>
                            <span className="text-sm text-gray-500 font-bold block">{isHK ? "戶外風速" : "平均風速"}</span>
                            <span className="text-lg font-black text-sky-950 font-mono">
                              {weather.windSpeed.toFixed(1)} km/h
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-teal-50/50 p-2.5 rounded-2xl">
                          <CloudRain className="w-6 h-6 text-teal-600" />
                          <div>
                            <span className="text-sm text-gray-500 font-bold block">{isHK ? "降水情況" : "目前降雨"}</span>
                            <span className="text-lg font-black text-teal-950 font-mono">
                              {weather.precipitation.toFixed(1)} mm
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Empathetic Elder Reminder Section */}
                    {(() => {
                      const reminder = getElderlyReminder(weather);
                      return (
                        <div className="bg-[#FFF8E1] border-3 border-amber-400 rounded-[36px] p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden">
                          {/* Saffron background highlight bar */}
                          <div className="absolute top-0 left-0 right-0 h-3 bg-amber-400"></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
                            <h4 className="text-2xl sm:text-3xl font-black text-[#D84315]">
                              {reminder.title}
                            </h4>
                            
                            {/* Speech Synthesis Broadcast assist */}
                            <button
                              id="speak-weather-remind-btn"
                              onClick={speakWeather}
                              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-orange-950 font-black text-base sm:text-lg cursor-pointer transform active:scale-95 transition-all select-none shadow-[3px_3px_0_#1E1E1E] ${
                                isSpeaking
                                  ? "bg-red-500 text-white animate-pulse"
                                  : "bg-white text-[#D84315] hover:bg-orange-50"
                              }`}
                            >
                              {isSpeaking ? (
                                <>
                                  <Square className="w-5 h-5 fill-current stroke-0" />
                                  <span>{isHK ? "停止語音" : "停止語音"}</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-5 h-5 stroke-[2.5]" />
                                  <span>{isHK ? "聽廣東話語音 🔊" : "聽國語語音 🔊"}</span>
                                </>
                              )}
                            </button>
                          </div>

                          <p className="text-xl sm:text-2xl font-bold text-[#5D4037] leading-relaxed mt-2 select-text">
                            {reminder.content}
                          </p>
                        </div>
                      );
                    })()}

                  </div>
                ) : (
                  <p className="text-lg text-gray-500 text-center">{isHK ? "未知天氣狀態" : "未知天氣狀態"}</p>
                )}

              </div>

              {/* Box Footer Banner */}
              <div className="bg-amber-50 px-6 sm:px-8 py-4 text-center border-t-2 border-gray-100 select-none">
                <p className="text-gray-500 font-bold text-sm sm:text-base">
                  {isHK 
                    ? "☁️ 天氣數據即時取材自 Open-Meteo，完全免費，不耗用個人 AI Quota 額度。" 
                    : "☁️ 本地天氣數據經由 Open-Meteo 免費網絡提供，不涉及任何個人 AI Quota 額度限制。"
                  }
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
