import React from "react";

export default function RankingItem({ bgColor, title }) {
  return (
    <div
      className="w-full h-[120px] rounded-[15px] mb-[10px] flex justify-center items-center"
      style={{ backgroundColor: bgColor }}
    >
      {title == "1" || title == "2" || title == "3" ? (
        <div className="h-[60%] w-[13%] bg-[#252525] rounded-[8px] flex justify-center items-center text-5xl mr-[30px]">
          {title == "1" ? "🥇" : title == "2" ? "🥈" : "🥉"}
        </div>
      ) : (
        <div className="h-[60%] w-[13%] flex justify-center items-center text-3xl font-bold text-[#A7A7A7] mr-[30px]">
          {title}위
        </div>
      )}
      <div className="text-[25px] w-[70%]">평균 집중도 93%의 퀸기홍</div>
    </div>
  );
}
