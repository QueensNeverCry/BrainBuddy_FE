import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Brain,
  Clock,
  MapPin,
  BookOpen,
  Play,
  BarChart3,
  Calendar,
  Award,
} from "lucide-react";
import TutorialModal from "../components/TutorialModal";
import ReportModal from "../components/ReportModal";
import { clearTokens, fetchWithAutoRefresh } from "../api/AuthApi";
import UserModal from "../components/UserModal";

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // /webcam에서 들어올 때 학습 기록 정보 확인
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [nickname, setNickname] = useState("");

  // 더미 데이터로 임시 쓰는중 -> 데이터가 있을 시에 dummy뺴기
  const [userStats, setUserStats] = useState({
    // nickname: "",
    // avgFocus: 0,
    // totalSessions: 0,
    // currentRank: 0,
    // totalUsers: 0,
  });
  const [recentReports, setRecentReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redirectToHome, setRedirectToHome] = useState(false);

  const timeOptions = [
    "오전 6:00",
    "오전 7:00",
    "오전 8:00",
    "오전 9:00",
    "오전 10:00",
    "오전 11:00",
    "오후 12:00",
    "오후 1:00",
    "오후 2:00",
    "오후 3:00",
    "오후 4:00",
    "오후 5:00",
    "오후 6:00",
    "오후 7:00",
    "오후 8:00",
    "오후 9:00",
    "오후 10:00",
    "오후 11:00",
  ];

  const placeOptions = [
    "집",
    "도서관",
    "카페",
    "스터디룸",
    "학교",
    "직장",
    "기타",
  ];

  const subjectOptions = [
    "퀸기홍의 연애상담",
    "수학",
    "영어",
    "국어",
    "과학",
    "사회",
    "독서",
    "코딩",
    "자격증",
    "어학",
    "기타",
  ];

  // // 더미 데이터
  // const userStats = {
  //   nickname: nickname,
  //   totalSessions: 23,
  //   avgFocus: 87.5,
  //   currentRank: 12,
  //   totalUsers: 1542,
  //   weeklyFocus: [78, 82, 85, 88, 90, 87, 89],
  // };

  // const recentReports = [
  //   {
  //     id: 1,
  //     date: "2025-01-08",
  //     time: "오후 2:00",
  //     place: "도서관",
  //     subject: "영어 스피킹",
  //     score: 92.3,
  //     duration: "45분",
  //   },
  //   {
  //     id: 2,
  //     date: "2025-01-07",
  //     time: "오전 10:00",
  //     place: "집",
  //     subject: "수학 문제풀이",
  //     score: 88.7,
  //     duration: "60분",
  //   },
  //   {
  //     id: 3,
  //     date: "2025-01-06",
  //     time: "오후 4:00",
  //     place: "카페",
  //     subject: "독서",
  //     score: 85.2,
  //     duration: "30분",
  //   },
  //   {
  //     id: 4,
  //     date: "2025-01-05",
  //     time: "오후 3:00",
  //     place: "스터디룸",
  //     subject: "코딩",
  //     score: 90.0,
  //     duration: "120분",
  //   },
  // ];
  useEffect(() => {
    const fetchMainInfo = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchWithAutoRefresh(
          // "https://localhost:8443/api/dashboard/main-info",
          "http://localhost:8500/api/dashboard/main-info",
          { method: "GET", credentials: "include" }
        );

        if (data.status === 401) {
          // 새 사용자, 데이터 없음
          console.log("신규 사용자: main-info 없음");
          setUserStats({
            nickname: localStorage.getItem("nickname") || "",
            totalSessions: 0,
            avgFocus: 0,
            currentRank: 0,
            totalUsers: 0,
          });
          setRecentReports([]);
          return;
        }

        if (data.body?.state === "success") {
          const b = data.body;
          setUserStats({
            nickname: b.user_name,
            totalSessions: b.total_study_cnt,
            avgFocus: b.avg_focus,
            currentRank: b.current_rank,
            totalUsers: b.total_users,
          });
          setRecentReports(b.history);
          localStorage.setItem("nickname", b.user_name);
          setNickname(b.user_name);
        } else {
          throw new Error(data.message || "데이터 처리 실패");
        }
      } catch (err) {
        console.error("🔥 fetchMainInfo 오류:", err);
        // 토큰 오류가 아니라면 페이지는 보여주고, error 메시지만 표시
        if (err.message === "LOGIN_AGAIN" || err.message === "TOKEN_INVALID") {
          clearTokens();
          navigate("/");
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMainInfo();

    const handler = () => fetchMainInfo();
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [navigate]);

  //       if (data.body?.state === "success") {
  //         // 유저 데이터 세팅
  //         const b = data.body;
  //         setUserStats({
  //           nickname: b.user_name,
  //           avgFocus: b.avg_focus,
  //           totalSessions: b.total_study_cnt,
  //           currentRank: b.current_rank,
  //           totalUsers: b.total_users,
  //         });
  //         setRecentReports(b.history);

  //         // nickname localStorage에 저장
  //         localStorage.setItem("nickname", b.user_name);
  //       } else {
  //         throw new Error(data.message || "메인 정보 로드 실패");
  //       }
  //     } catch (error) {
  //       console.error("메인 페이지 API 오류: ", error.message);
  //       clearTokens(); // JWT 초기화
  //       navigate("/"); // 로그인 페이지 이동
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchMainInfo();

  //   // 창 focus 시도 자동 업데이트
  //   const handler = () => fetchMainInfo();
  //   window.addEventListener("focus", handler);
  //   return () => window.removeEventListener("focus", handler);
  // }, [navigate]);
  // ===============================================================

  // 최근 분석 리포트
  // useEffect(() => {
  //   const fetchMainInfo = async () => {
  //     try {
  //       setLoading(true);
  //       setError("");

  //       const data = await fetchWithAutoRefresh(
  //         "https://localhost:8443/api/dashboard/main-info",
  //         // "https://192.168.45.194:8443/api/dashboard/main-info",
  //         { method: "GET" }
  //       );

  //       if (!data || typeof data !== "object") {
  //         throw new Error("서버 응답이 올바르지 않습니다.");
  //       }

  //       if (data.status === "FAILURE") {
  //         throw new Error(data.message || "알 수 없는 오류");
  //       }
  //       if (data.body?.state === "success") {
  //         const b = data.body;
  //         setUserStats({
  //           nickname: b.user_name,
  //           totalSessions: b.total_study_cnt,
  //           avgFocus: b.avg_focus,
  //           currentRank: b.current_rank,
  //           totalUsers: b.total_users,
  //         });
  //         setRecentReports(b.history);
  //       } else {
  //         throw new Error("데이터 처리 실패");
  //       }
  //     } catch (err) {
  //       console.error("🔥 fetchMainInfo 오류:", err);

  //       if (err.message === "LOGIN_AGAIN" || err.message === "TOKEN_INVALID") {
  //         clearTokens();
  //         navigate("/");
  //         return;
  //       }

  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMainInfo();

  //   const handler = () => fetchMainInfo();
  //   window.addEventListener("focus", handler);
  //   return () => window.removeEventListener("focus", handler);
  // }, [navigate]);
  // ============================================================

  // // 로그인 실패 시 강제 리다이렉트
  // useEffect(() => {
  //   if (redirectToHome) {
  //     navigate("/");
  //   }
  // }, [redirectToHome, navigate]);

  // useEffect(() => {
  //   // 튜토리얼을 보지 않겠다고 체크하지 않았다면 자동으로 표시
  //   const hideNextTime = localStorage.getItem("hideTutorial");
  //   if (!hideNextTime) {
  //     setShowTutorial(true);
  //   }

  //   // const storedNickname = localStorage.getItem("nickname");
  //   // if (storedNickname) {
  //   //   setNickname(storedNickname);
  //   // }
  // }, []);

  // // 로딩 또는 에러 표시
  // if (loading || error) {
  //   return (
  //     <div>
  //       {loading && "로딩 중...."}
  //       {error && `오류 발생: ${error}`}
  //     </div>
  //   );
  // }

  // =======================================================
  // // 더미 데이터
  // const dummyuserStats = {
  //   nickname: nickname,
  //   totalSessions: 23,
  //   avgFocus: 87.5,
  //   currentRank: 12,
  //   totalUsers: 1542,
  //   weeklyFocus: [78, 82, 85, 88, 90, 87, 89],
  // };

  // const dummyrecentReports = [
  //   {
  //     id: 1,
  //     date: "2025-01-08",
  //     time: "오후 2:00",
  //     place: "도서관",
  //     subject: "영어 스피킹",
  //     score: 92.3,
  //     duration: "45분",
  //   },
  //   {
  //     id: 2,
  //     date: "2025-01-07",
  //     time: "오전 10:00",
  //     place: "집",
  //     subject: "수학 문제풀이",
  //     score: 88.7,
  //     duration: "60분",
  //   },
  //   {
  //     id: 3,
  //     date: "2025-01-06",
  //     time: "오후 4:00",
  //     place: "카페",
  //     subject: "독서",
  //     score: 85.2,
  //     duration: "30분",
  //   },
  //   {
  //     id: 4,
  //     date: "2025-01-05",
  //     time: "오후 3:00",
  //     place: "스터디룸",
  //     subject: "코딩",
  //     score: 90.0,
  //     duration: "120분",
  //   },
  // ];

  // const timeOptions = [
  //   "오전 6:00",
  //   "오전 7:00",
  //   "오전 8:00",
  //   "오전 9:00",
  //   "오전 10:00",
  //   "오전 11:00",
  //   "오후 12:00",
  //   "오후 1:00",
  //   "오후 2:00",
  //   "오후 3:00",
  //   "오후 4:00",
  //   "오후 5:00",
  //   "오후 6:00",
  //   "오후 7:00",
  //   "오후 8:00",
  //   "오후 9:00",
  //   "오후 10:00",
  //   "오후 11:00",
  // ];

  // const placeOptions = [
  //   "집",
  //   "도서관",
  //   "카페",
  //   "스터디룸",
  //   "학교",
  //   "직장",
  //   "기타",
  // ];

  // const subjectOptions = [
  //   "퀸기홍의 연애상담",
  //   "수학",
  //   "영어",
  //   "국어",
  //   "과학",
  //   "사회",
  //   "독서",
  //   "코딩",
  //   "자격증",
  //   "어학",
  //   "기타",
  // ];

  const canStartSession = selectedTime && selectedPlace && selectedSubject;

  const handleStartSession = () => {
    if (canStartSession) {
      navigate("/webcam", {
        state: {
          time: selectedTime,
          place: selectedPlace,
          subject: selectedSubject,
        },
      });
    }
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-emerald-400" />
              <span className="text-2xl font-bold text-gray-900">
                BrainBuddy
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {userStats && (
                  <p className="font-semibold text-gray-900">
                    {userStats.nickname}
                  </p>
                )}
                <p className="text-sm text-emerald-400">
                  현재 {userStats.currentRank || "-"}등이에요!🔥
                </p>
              </div>
              {/* 로그아웃, 회원탈퇴 */}
              <UserModal />
              {/* <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-400" />
              </div> */}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-emerald-400" />
              <span className="text-2xl font-bold text-emerald-400">
                {userStats.avgFocus}%
              </span>
            </div>
            <p className="text-gray-600 font-medium">평균 집중도</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-[#46639d]" />
              <span className="text-2xl font-bold text-[#46639d]">
                {userStats.totalSessions}
              </span>
            </div>
            <p className="text-gray-600 font-medium">총 학습 횟수</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-[#d9d248]" />
              <span className="text-2xl font-bold text-[#d9d248]">
                #{userStats.currentRank}
              </span>
            </div>
            <p className="text-gray-600 font-medium">현재 랭킹</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 text-[#9737e6]" />
              <span className="text-2xl font-bold text-[#9737e6]">
                {userStats.totalUsers}
              </span>
            </div>
            <p className="text-gray-600 font-medium">전체 사용자</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Setup */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              새로운 학습 시작
            </h2>

            <div className="space-y-6">
              {/* 언제 */}
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-3">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>언제</span>
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">시간을 선택하세요</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* 어디서 */}
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>어디서</span>
                </label>
                <select
                  value={selectedPlace}
                  onChange={(e) => setSelectedPlace(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">장소를 선택하세요</option>
                  {placeOptions.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
              </div>

              {/* 무엇을 */}
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-3">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>무엇을</span>
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">학습 주제를 선택하세요</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleStartSession}
                disabled={!canStartSession}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  canStartSession
                    ? "bg-emerald-100 hover:bg-emerald-400 text-black hover:text-white hover:scale-105 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Play className="w-5 h-5" />
                <span>학습 시작하기</span>
              </button>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              최근 분석 리포트
            </h2>

            <div className="space-y-4 h-96 overflow-y-auto scrollbar-hide">
              {recentReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  아직 분석된 리포트가 없습니다.
                </p>
              ) : (
                recentReports.map((report, idx) => (
                  // {recentReports.map((report, idx) => (
                  <div
                    key={report.id || idx}
                    onClick={() => handleReportClick(report)}
                    className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {report.subject}
                        </p>
                        <p className="text-sm text-gray-500">
                          {report.date} {report.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400">
                          {report.score}점
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-emerald-300" />
                        <span>{report.place}</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal
          onClose={() => setShowTutorial(false)}
          onHideNextTime={() => {
            localStorage.setItem("hideTutorial", "true");
            setShowTutorial(false);
          }}
        />
      )}

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => {
            setShowReportModal(false);
            setSelectedReport(null);
          }}
        />
      )}
    </div>
  );
};

export default MainPage;
