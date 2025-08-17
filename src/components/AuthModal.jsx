import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { fetchWithAutoRefresh } from "../api/AuthApi";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    confirmPassword: "",
  });
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
  // 닉네임 에러 메시지 상태
  const [nicknameError, setNicknameError] = useState("");

  // 언더바/하이픈, 2~16자)
  const NAME_PATTERN = /^[A-Za-z0-9가-힣_-]{2,16}$/;

  // 비밀번호 확인 체크
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

  // 닉네임 입력 시 서버에서 중복 체크
  const handleNicknameChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, nickname: value });

    if (value.trim() === "") setNicknameError("");
  };

  // ✅ 프론트 유효성 검사
  const validateForm = () => {
    // 모든 필드 입력 여부
    if (
      !formData.email ||
      !formData.password ||
      (!isLogin && (!formData.nickname || !formData.confirmPassword))
    ) {
      alert("모든 필드를 입력해주세요.");
      return false; // INVALID_FORMAT
    }

    if (!isLogin) {
      // 닉네임 형식 검사
      if (!NAME_PATTERN.test(formData.nickname)) {
        alert("닉네임은 2~16자의 한글, 영문, 숫자, _, -만 가능합니다.");
        return false; // INVALID_FORMAT
      }

      // 비밀번호 길이 검사
      if (formData.password.length < 8 || formData.password.length > 24) {
        alert("비밀번호는 8~24자여야 합니다.");
        return false; // INVALID_PW
      }

      // 비밀번호 일치 여부
      if (formData.password !== formData.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return false; // INVALID_PW
      }
    }

    return true; // 통과
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const url = isLogin
      ? // ? "https://localhost:8443/api/auth/log-in"
        // : "https://localhost:8443/api/auth/sign-up";
        "http://localhost:8500/api/auth/log-in"
      : "http://localhost:8500/api/auth/sign-up";

    const payload = isLogin
      ? {
          email: formData.email,
          user_pw: formData.password,
        }
      : {
          user_name: formData.nickname,
          email: formData.email,
          user_pw: formData.password,
          user_pw_confirm: formData.confirmPassword,
        };

    try {
      const data = await fetchWithAutoRefresh(url, {
        method: "POST",
        credentials: "include", // 쿠키 포함
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("서버 응답🔥🔥🔥🔥:", data);

      if (data.body?.code !== "success") {
        // 로그인 전용 오류 코드 처리
        if (isLogin) {
          if (data.body?.code === "USER_NOT_EMAIL") {
            alert("올바르지 않은 이메일입니다.");
          } else if (data.body?.code === "USER_NOT_PW") {
            alert("올바르지 않은 비밀번호입니다.");
          } else if (data.body?.code === "USER_NOT_FOUND") {
            alert("존재하지 않는 계정입니다.");
          } else if (data.body?.code === "WRONG_FORMAT") {
            alert("입력 형식이 올바르지 않습니다.");
          } else {
            alert(data.message || "로그인 중 오류가 발생했습니다.");
          }
        } else {
          // 회원가입 관련 오류 코드
          if (data.body?.code === "USER_EXISTS_NAME") {
            alert("이미 존재하는 닉네임입니다.");
          } else if (data.body?.code === "USER_EXISTS_EMAIL") {
            alert("이미 존재하는 이메일입니다.");
          } else if (data.body?.code === "INVALID_FORMAT") {
            alert("올바른 형식으로 입력해주세요.");
          } else if (data.body?.code === "INVALID_PW") {
            alert("비밀번호가 일치하지 않습니다.");
          } else {
            alert(data.message || "회원가입 중 오류가 발생했습니다.");
          }
        }

        return;
      }

      // 로그인 or 회원가입 성공 시 토큰과 닉네임 저장
      const { accessToken, refreshToken, user_name } = data.body;
      // localStorage.setItem("access", accessToken);
      // localStorage.setItem("refresh", refreshToken);
      localStorage.setItem("nickname", data.body.user_name || ""); // 닉네임 저장

      // 로그인 또는 회원가입이 "성공"했을 때 실행되는 블록
      alert(isLogin ? "로그인 성공!" : "회원가입이 완료되었습니다!");
      onSuccess(); // 모달 닫기, 페이지 이도 등의 후속 처리
      navigate("/main");
    } catch (error) {
      console.error("⚠️⚠️로그인 중 에러 발생:", error);
      // alert("세션이 만료되어 다시 로그인 해주세요.");
      alert(`로그인 실패: ${error.message}`);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      nickname: "",
      password: "",
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
                  onChange={handleNicknameChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#bccebe] focus:outline-none placeholder:text-[13px]"
                  placeholder="사용할 닉네임을 입력하세요"
                  required
                />
              </div>

              {/* 닉네임 에러 메시지 */}
              {nicknameError && (
                <p className="text-red-500 text-sm mt-1">{nicknameError}</p>
              )}
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

          {/* 버튼 */}
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
