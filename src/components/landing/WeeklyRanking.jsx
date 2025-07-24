import React from "react";
import RankingItem from "./RankingItem";

export default function WeeklyRanking() {
  const items = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="w-[30vw] h-[90vh] flex flex-col justify-center items-center m-2.5">
      <div className="w-full h-[13%] p-[15px] flex flex-col justify-center">
        <p className="text-4xl font-bold pb-[5px]">Weekly Ranking</p>
        <p className="text-[20px]">
          브레인 버디는 <span className="font-bold">512명의</span> 사용자와 함께
          하고 있어요.
        </p>
      </div>
      <div className="w-full h-[87%]">
        <div className="w-full h-[46%]">
          <RankingItem bgColor="#9cba95" title="1" />
          <RankingItem bgColor="#b8d3b1" title="2" />
          <RankingItem bgColor="#d8e5d4" title="3" />
        </div>
        <div className="w-full h-[54%] overflow-y-auto pt-[15px] scrollbar-hidden">
          {items.map((item, index) => (
            <RankingItem key={index} bgColor="#ededed" title={index + 4} />
          ))}
        </div>
      </div>
    </div>
  );
}
