import React from "react";

export default function LandingIntro() {
  return (
    <div className="w-[35vw] h-screen flex flex-col justify-center p-[15px]">
      <p className="text-[48px] font-semibold mb-[5px]">
        뇌 친구, 내 친구 : BrainBuddy
      </p>
      <p className="text-[20px] text-[rgb(69,69,69)] mb-[40px]">
        당신의 집중력은 어떤 모습인가요?
        <br />
        BrainBuddy는 당신의 뇌와 친구가 됩니다.
      </p>
      <div className="w-full h-[70px] flex justify-center">
        <button className="w-[350px] h-[70px] bg-[#eeeeee] rounded-[20px] text-[20px] font-semibold hover:bg-[#7e9878] hover:text-[#ffffff] transition duration-300">
          시작하기
        </button>
      </div>
    </div>
  );
}
