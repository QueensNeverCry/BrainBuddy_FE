import React from "react";

export default function SignupForm() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* <div className="max-w-md w-full mx-auto p-8 rounded-lg shadow-md"> */}
      <div className="w-full max-w-[400px] border border-gray-200 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-10">새로운 버디, 환영해요!</h2>

        {/* 이름 */}
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 font-bold text-[14px]">
            이름
          </label>
          <input
            id="name"
            type="text"
            placeholder="이름을 입력해주세요"
            className="w-full border border-gray-300 rounded px-4 py-3 text-[14px] placeholder:text-[11px] focus:outline-none focus:ring focus:border-black"
          />
        </div>

        {/* 닉네임 */}
        <div className="mb-6">
          <label
            htmlFor="nickname"
            className="block mb-2 font-bold text-[14px]"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력해주세요"
            className="w-full border border-gray-300 rounded px-4 py-3 text-[14px] placeholder:text-[11px] focus:outline-none focus:ring focus:border-black"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-6 relative">
          <label
            htmlFor="password"
            className="block mb-2 font-bold text-[14px]"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="text"
            placeholder="비밀번호를 입력해주세요"
            className="w-full border border-gray-300 rounded px-4 py-3 pr-10 text-[14px] placeholder:text-[11px] focus:outline-none focus:ring focus:border-black"
          />
        </div>

        {/* 비밀번호 재확인 */}
        <div className="mb-8">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 font-bold text-[14px]"
          >
            비밀번호 재확인
          </label>
          <input
            id="confirmPassword"
            type="text"
            placeholder="비밀번호를 재입력해주세요"
            className="w-full border border-gray-300 rounded px-3 py-3 text-[14px] placeholder:text-[11px] focus:outline-none focus:ring focus:border-black "
          />
        </div>

        {/* 가입 버튼 */}
        <button
          style={{ backgroundColor: "#BCCEBE" }}
          className="w-full bg-green-100 hover:bg-green-200 text-black text-[13px] font-bold py-2 rounded"
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
}
