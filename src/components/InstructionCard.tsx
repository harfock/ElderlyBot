import { motion } from "motion/react";
import { InstructionItem } from "../types";

interface InstructionCardProps {
  key?: string;
  item: InstructionItem;
  onClick: () => void;
}

export default function InstructionCard({ item, onClick }: InstructionCardProps) {
  return (
    <motion.button
      id={`card-btn-${item.id}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col justify-between text-left p-6 bg-white border-[6px] border-[#D84315] rounded-[36px] sm:rounded-[45px] shadow-[10px_10px_0px_rgba(216,67,21,0.18)] hover:shadow-[4px_4px_0px_rgba(216,67,21,0.15)] transition-all duration-150 min-h-[170px] w-full focus:outline-none focus:ring-4 focus:ring-orange-400 cursor-pointer text-[#1E1E1E]"
    >
      <div className="flex items-center gap-5 w-full">
        {/* Large Emoji Badge */}
        <span 
          className="text-5xl sm:text-6xl p-3 bg-[#FFF8E1] rounded-[24px] flex items-center justify-center select-none shrink-0 border-3 border-dashed border-[#D84315]/40" 
          role="img" 
          aria-label={item.title}
        >
          {item.emoji}
        </span>
        
        {/* Text Area */}
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl sm:text-3xl font-black text-[#D84315] tracking-tight truncate">
            {item.title}
          </h3>
          <p className="text-lg sm:text-xl font-bold mt-1.5 text-[#5D4037] line-clamp-2 leading-relaxed">
            {item.shortText}
          </p>
        </div>
      </div>
      
      {/* Decorative Arrow Tag */}
      <div className="w-full flex justify-end items-center mt-4 pt-3 border-t-3 border-dashed border-[#FFF8E1]">
        <span className="text-base sm:text-lg font-black text-[#D84315] bg-[#FFF8E1] py-1.5 px-4 rounded-full border-2 border-[#D84315]/30 flex items-center gap-1 hover:bg-[#FFF3E0]">
          看詳細說明 📣 ➔
        </span>
      </div>
    </motion.button>
  );
}
