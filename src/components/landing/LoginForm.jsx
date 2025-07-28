import React from "react";

export default function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] border border-gray-200 p-8 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl black mb-10">
          Welcome to
          <br></br>
          <strong>BrainBuddy</strong>
        </h2>

        {/* 아이디 */}
        <div className="mb-6">
          <label htmlFor="userId" className="block mb-2 font-bold text-[14px]">
            아이디
          </label>
          <input
            id="userId"
            type="text"
            placeholder="아이디를 입력해주세요"
            className="w-full border border-gray-300 rounded px-4 py-3 text-[14px] placeholder:text-[11px] focus:outline-none focus:ring focus:border-black"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-8">
          <label
            htmlFor="password"
            className="block mb-2 font-bold text-[14px]"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="w-full border border-gray-300 rounded px-4 py-3 text-[14px] placeholder:text-[11px] focus:outline-none focus:ring focus:border-black"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          style={{ backgroundColor: "#BCCEBE" }}
          className="w-full text-black text-[13px] font-bold py-2 rounded mb-3"
        >
          로그인
        </button>

        {/* 회원가입 하러가기 버튼 */}
        <button
          style={{ backgroundColor: "#E8E8E8" }}
          className="w-full text-black text-[13px] font-bold py-2 rounded"
        >
          회원가입 하러가기
        </button>
      </div>
    </div>
  );
}
