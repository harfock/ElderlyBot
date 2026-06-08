import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Clock, Flame, ShieldCheck, Soup, ChevronRight, HelpCircle } from "lucide-react";
import { COOKING_METHODS, CookingMethod, Recipe } from "../cookingData";
import CookingRecipeModal from "./CookingRecipeModal";

interface CookingSectionProps {
  voiceLang: "zh-HK" | "zh-TW";
}

export default function CookingSection({ voiceLang = "zh-HK" }: CookingSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<CookingMethod | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const isHK = voiceLang === "zh-HK";

  // Translate labels based on target speaking/reading language
  const backBtnText = isHK ? "👈 返轉頭 (回上一頁)" : "👈 返回上一頁";
  const mainTitleText = isHK ? "🍳 港式抗三高健康食譜 (蒸・炒・炆・焗)" : "🍳 港式高齡防護健康食譜 (蒸・炒・炆・焗)";
  const mainSubText = isHK 
    ? "家常小炒、清蒸、滋補炆菜、多汁烘焗。低鹽、少油、好咀嚼，點擊四大分類睇食譜：" 
    : "家常小炒、營養清蒸、滋補慢炆、多汁烘焗。低鹽、少油、易吞嚥，點擊四大分類看食譜：";

  const emptyHeader = isHK ? "請先點擊下方一個烹飪分類" : "請點擊下方一個烹調分類";

  const getMethodColorClass = (id: string, active: boolean) => {
    switch (id) {
      case "steam":
        return active ? "bg-sky-500 text-white border-[#1E1E1E]" : "bg-sky-50 hover:bg-sky-100/70 border-sky-200 text-sky-850";
      case "fry":
        return active ? "bg-amber-500 text-white border-[#1E1E1E]" : "bg-amber-50 hover:bg-amber-100/70 border-amber-200 text-amber-850";
      case "stew":
        return active ? "bg-emerald-500 text-white border-[#1E1E1E]" : "bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-850";
      case "bake":
        return active ? "bg-rose-500 text-white border-[#1E1E1E]" : "bg-rose-50 hover:bg-rose-100/70 border-rose-200 text-rose-850";
      default:
        return active ? "bg-[#D84315] text-white border-[#1E1E1E]" : "bg-white hover:bg-orange-50 text-gray-850";
    }
  };

  const getMethodBadgeColor = (id: string) => {
    switch (id) {
      case "steam": return "bg-sky-100 text-sky-800 border-sky-300";
      case "fry": return "bg-amber-100 text-amber-850 border-amber-300";
      case "stew": return "bg-emerald-100 text-emerald-850 border-emerald-300";
      case "bake": return "bg-rose-100 text-rose-855 border-rose-300";
      default: return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  return (
    <div id="cooking-section-wrapper" className="w-full">
      
      {/* Cooking Main Header Panel */}
      <div className="bg-white border-[6px] border-[#D84315] rounded-[40px] p-6 sm:p-8 mb-8 shadow-[8px_8px_0px_rgba(216,67,21,0.12)]">
        <h3 className="text-2.5xl sm:text-4xl font-black text-[#D84315] flex items-center gap-2.5 flex-wrap">
          <span>{mainTitleText}</span>
        </h3>
        <p className="text-xl sm:text-2xl text-[#5D4037] font-bold mt-2 leading-relaxed">
          {mainSubText}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedMethod ? (
          /* View A: The 4-Grids Menu Select Method (蒸、炒、炆、焗) */
          <motion.div
            key="grid-entrance"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {COOKING_METHODS.map((method) => {
              const themeColor = getMethodColorClass(method.id, false);
              const mName = isHK ? method.nameCantonese : method.name;
              const mDesc = isHK ? method.descriptionCantonese : method.description;
              const mTag = isHK ? method.tagCantonese : method.tag;

              return (
                <button
                  key={method.id}
                  id={`method-btn-${method.id}`}
                  onClick={() => setSelectedMethod(method)}
                  className={`relative p-8 rounded-[36px] border-[6px] border-[#1E1E1E] text-left transition-all transform hover:scale-103 active:translate-y-1 cursor-pointer select-none shadow-[10px_10px_0px_#1E1E1E] flex flex-col justify-between min-h-[260px] group ${themeColor}`}
                >
                  <div>
                    {/* Method Badge & Emoji */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-6xl select-none" role="img" aria-label="emoji">
                        {method.emoji}
                      </span>
                      <span className={`text-base sm:text-lg font-black border-2 px-3.5 py-1 rounded-full ${getMethodBadgeColor(method.id)}`}>
                        {mTag}
                      </span>
                    </div>

                    {/* Method Headline */}
                    <h4 className="text-3xl sm:text-4.5xl font-black text-[#1E1E1E] tracking-tight mb-2 group-hover:text-[#D84315] transition-colors">
                      {mName}
                    </h4>

                    {/* Description tailored for Cantonese / elderly */}
                    <p className="text-xl sm:text-22px text-[#5D4037] font-bold leading-normal">
                      {mDesc}
                    </p>
                  </div>

                  {/* Responsive Call to action */}
                  <div className="mt-6 flex items-center justify-between text-lg sm:text-xl font-black text-[#D84315] border-t-2 border-dashed border-gray-300 pt-4 w-full">
                    <span>{isHK ? "👉 點擊開啟餐單食譜" : "👉 點擊查看美味食譜"}</span>
                    <ChevronRight className="w-6 h-6 stroke-[3] transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </motion.div>
        ) : (
          /* View B: Sub-page Listing Classic HK Household Recipes for Selected Method */
          <motion.div
            key="recipe-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-6"
          >
            {/* Listing Control Back Button & Mode Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <button
                id="back-to-grids-btn"
                onClick={() => setSelectedMethod(null)}
                className="flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-white hover:bg-orange-50 text-[#1E1E1E] border-4 border-[#1E1E1E] font-black text-xl cursor-pointer shadow-[4px_4px_0_#1E1E1E] transition-all transform active:scale-95 text-center select-none"
              >
                <ArrowLeft className="w-6 h-6 stroke-[3.5]" />
                <span>{backBtnText}</span>
              </button>

              <div className="bg-[#FFF3E0] border-[3.5px] border-[#D84315]/40 rounded-2xl py-2.5 px-5 text-lg sm:text-xl font-black text-[#D84315] flex items-center gap-2">
                <span className="text-2xl select-none">{selectedMethod.emoji}</span>
                <span>{isHK ? `正在查看：${selectedMethod.nameCantonese}` : `當前烹飪：${selectedMethod.name}`}</span>
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {selectedMethod.recipes.map((recipe) => {
                const rTitle = isHK ? recipe.titleCantonese : recipe.title;

                return (
                  <div
                    key={recipe.id}
                    className="bg-white border-[6px] border-[#1E1E1E] rounded-[36px] p-6 sm:p-7 shadow-[8px_8px_0_#1E1E1E] flex flex-col justify-between hover:border-[#D84315] hover:shadow-[8px_8px_0_rgba(216,67,21,0.15)] transition-all"
                  >
                    <div>
                      {/* Top metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 border-b-2 border-dashed border-gray-150 pb-3">
                        <div className="flex items-center gap-1 text-[#5D4037] text-lg font-black">
                          <span className="text-3xl select-none" role="img" aria-label="emoji">
                            {recipe.emoji}
                          </span>
                          <span className="ml-1">{rTitle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-yellow-50 text-yellow-800 text-sm font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-yellow-200">
                            <Clock className="w-3.5 h-3.5" />
                            {recipe.prepTime}
                          </span>
                        </div>
                      </div>

                      {/* Nutrient Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-red-50 text-red-750 text-sm font-black px-3 py-1 rounded-full flex items-center gap-1 border border-red-150">
                          <Flame className="w-3.5 h-3.5 text-red-500" />
                          {isHK ? `估計開銷：${recipe.calories} kcal 卡路里` : `${recipe.calories} kcal`}
                        </span>
                        <span className="bg-orange-50 text-orange-850 text-sm font-black px-3 py-1 rounded-full flex items-center gap-1 border border-orange-150">
                          <Soup className="w-3.5 h-3.5 text-orange-500" />
                          {isHK ? `估計脂肪：${recipe.fat} 克` : `脂肪: ${recipe.fat}克`}
                        </span>
                      </div>

                      {/* Seasoning levels recommendations */}
                      <div className="bg-[#FFF8E1] rounded-2xl p-4 border border-orange-200/50 mb-5 text-[#5D4037] text-base leading-relaxed">
                        <div className="font-extrabold text-[#D84315] flex items-center gap-1 text-base sm:text-lg mb-1.5 select-none">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>{isHK ? "👵 2-3人份 鹽油糖健康控量" : "👵 每份推薦之健康鹽油糖標準"}</span>
                        </div>
                        <div className="font-bold text-base space-y-0.5">
                          <div>📍 {isHK ? `建議油：${recipe.oil}` : `油量: ${recipe.oil}`}</div>
                          <div>📍 {isHK ? `建議鹽：${recipe.salt}` : `鹽分: ${recipe.salt}`}</div>
                          <div>📍 {isHK ? `建議糖：${recipe.sugar}` : `糖分: ${recipe.sugar}`}</div>
                        </div>
                      </div>

                      {/* Teaser text / Brief step view */}
                      <p className="text-lg sm:text-xl font-medium text-gray-500 leading-normal pl-1 mb-5">
                        {isHK ? "食材包括：" : "食材包括："}
                        {recipe.ingredients.map(ing => ing.name).join('、')}等。
                      </p>
                    </div>

                    {/* View details Action button */}
                    <button
                      id={`view-recipe-btn-${recipe.id}`}
                      onClick={() => setSelectedRecipe(recipe)}
                      className="w-full py-4 rounded-[20px] bg-[#D84315] hover:bg-[#BF360C] text-white border-[3px] border-[#1E1E1E] font-black text-xl cursor-pointer shadow-[3px_3px_0_#1E1E1E] transform active:translate-y-0.5 transition-all text-center select-none"
                    >
                      📖 {isHK ? "睇詳細食譜同步驟 (有廣東話語音朗讀)" : "看詳細食譜與步驟 (支持語音播放)"}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe reading modal popup */}
      <CookingRecipeModal
        recipe={selectedRecipe}
        method={selectedMethod}
        isOpen={selectedRecipe !== null}
        onClose={() => setSelectedRecipe(null)}
        voiceLang={voiceLang}
      />

    </div>
  );
}
