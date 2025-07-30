import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const AuthModal = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    confirmPassword: "",
  });
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);

  // 실시간 비밀번호 불일치 체크
  useEffect(() => {
    if (!isLogin && formData.password && formData.confirmPassword) {
      setIsPasswordMismatch(formData.password !== formData.confirmPassword);
    } else {
      setIsPasswordMismatch(false);
    }
  }, [formData.password, formData.confirmPassword, isLogin]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin) {
      // 로컬 회원가입 저장
      const { email, password, nickname } = formData;
      localStorage.setItem(
        "brainbuddyUser",
        JSON.stringify({ email, password, nickname })
      );
      localStorage.setItem("nickname", nickname); // 닉네임 따로 저장
      alert("회원가입이 완료되었습니다.");
      switchMode(); // 로그인 폼으로 전환
    } else {
      // 로그인 로직 (간단한 localStorage 매칭)
      const storedUser = JSON.parse(localStorage.getItem("brainbuddyUser"));
      if (
        storedUser &&
        storedUser.email === formData.email &&
        storedUser.password === formData.password
      ) {
        localStorage.setItem("nickname", storedUser.nickname); // 닉네임 재저장 (메인 페이지용)
        onSuccess(); // 로그인 성공
      } else {
        alert("이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      nickname: "",
      confirmPassword: "",
    });
    setIsPasswordMismatch(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Hello!👋🏻" : "Welcome to BrainBuddy.🧠"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                닉네임
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#bccebe] focus:outline-none placeholder:text-[13px]"
                  placeholder="사용할 닉네임을 입력하세요"
                  required
                />
              </div>
            </div>
          )}

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#bccebe] focus:outline-none placeholder:text-[13px]"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#bccebe] focus:outline-none placeholder:text-[13px]"
                placeholder="비밀번호를 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#bccebe] focus:outline-none placeholder:text-[13px]"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </div>
            </div>
          )}

          {/* 로그인/회원가입 버튼 */}
          <button
            type="submit"
            disabled={!isLogin && isPasswordMismatch}
            title={
              !isLogin && isPasswordMismatch
                ? "비밀번호가 일치하지 않습니다."
                : ""
            }
            className={`w-full py-3 rounded-xl font-semibold transition-colors duration-200 ${
              !isLogin && isPasswordMismatch
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-[#bccebe] hover:bg-[#a8b5aa] text-[#252525]"
            }`}
          >
            {isLogin ? "로그인" : "회원가입"}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
            <button
              onClick={switchMode}
              className="ml-2 text-[#2e3830] hover:text-[#798b7c] font-medium transition-colors duration-200"
            >
              {isLogin ? "회원가입" : "로그인"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
