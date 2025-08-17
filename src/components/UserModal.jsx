import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, UserX } from "lucide-react";
import AccountDeletion from "../pages/AccountDeletion";

const UserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [userStats, setUserStats] = useState({ nickname: "사용자" });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.nickname) {
          setUserStats({ nickname: decoded.nickname });
        }
      } catch (e) {
        console.error("토큰 디코딩 실패", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // const response = await fetch("https://localhost:8443/api/auth/log-out", {
      const response = await fetch("http://localhost:8500/api/auth/log-out", {
        method: "POST",
        credentials: "include", // 쿠키 자동 첨부
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // 401 체크
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
        navigate("/");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        if (data.status === "success") {
          alert(data.message || "로그아웃되었습니다.");
        } else if (data.coded === "TOKEN_INVALID") {
          alert("토큰이 유효하지 않습니다. 다시 로그인 해주세요.");
        } else {
          alert(data.messge || "알 수 없는 오류가 발생했습니다.");
        }
      } else {
        alert(`서버 으답 오류: ${response.status}`);
      }

      // 최종적으로 무조건 LandingPage로 이도
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
      alert("네트워크 오류가 발생하였습니다. 다시 시도해주세요.");
      // 네트워크 오류도 일단 LandingPage 이동
      navigate("/");
    }
  };

  const handleAccountDeletion = () => {
    navigate("/account-deletion");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center space-x-3">
        <span className="text-gray-700 font-medium">{userStats.nickname}</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors duration-200"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {userStats.nickname}
            </p>
            <p className="text-xs text-gray-500">사용자 설정</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left flex items-center text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-3" />
            로그아웃
          </button>

          <button
            onClick={handleAccountDeletion}
            className="w-full px-4 py-3 text-left flex items-center text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <UserX className="w-4 h-4 mr-3" />
            회원탈퇴
          </button>
        </div>
      )}
    </div>
  );
};

export default UserModal;
