import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Trophy, Users, Star, TrendingUp } from "lucide-react";
import AuthModal from "../components/AuthModal";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const [ranking, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(
          "http://10.221.251.50:9000/api/dashboard/weekly-ranking"
        );
        const data = await response.json();
        if (Array.isArray(data.ranking)) {
          setRankings(data.ranking);
          console.log("랭킹 데이터: ", data.ranking);
        } else {
          console.warn("랭킹 데이터 형식이 올바르지 않습니다:", data);
        }
      } catch (error) {
        console.error("랭킹 데이터를 불러오는 데 실패했습니다:", error);
      }
    };
    fetchRankings();
  }, []);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-emerald-400";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case true:
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case false:
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen">
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
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-emerald-100 hover:bg-emerald-400 text-black hover:text-white px-6 py-2 rounded-full transition-colors duration-200 font-semibold"
            >
              시작하기
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Brain className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              당신의 집중력을
              <span className="text-emerald-400 block mt-[5px]">
                분석해드립니다
              </span>
            </h1>
            <p className="text-[18px] text-gray-600 max-w-3xl mx-auto mb-8">
              AI 얼굴 분석 기술로 실시간 집중도를 측정하고, 개인화된 리포트와
              랭킹으로 학습 효율을 극대화하세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-emerald-300 hover:bg-emerald-400 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              무료로 시작하기
            </button>
            <button className="border-2 border-emerald-300 text-emerald-400 hover:bg-emerald-50 px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200">
              서비스 둘러보기
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow duration-200">
              <Brain className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">실시간 AI 분석</h3>
              <p className="text-gray-600">
                웹캠을 통한 얼굴 표정 분석으로 집중도를 실시간 측정합니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow duration-200">
              <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">랭킹 시스템</h3>
              <p className="text-gray-600">
                다른 사용자들과 집중력을 비교하고 경쟁하며 동기부여를 받으세요.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow duration-200">
              <Users className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">상세 리포트</h3>
              <p className="text-gray-600">
                개인화된 집중도 분석 리포트로 학습 패턴을 파악하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#ffffff] backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              실시간 집중도 랭킹
            </h2>
            <p className="text-gray-600">
              다른 사용자들의 집중력과 비교해보세요
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
              <h3 className="font-semibold text-emerald-400">
                TOP 5 집중력 마스터
              </h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto scrollbar-hide">
              {ranking.map((user) => (
                <div
                  key={user.rank}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold ${getRankColor(
                          user.rank
                        )}`}
                      >
                        {user.rank <= 3 && (
                          <Star className="w-5 h-5 fill-current" />
                        )}
                        {user.rank > 3 && user.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.user_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.total_cnt}회 학습
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-emerald-400">
                          {parseInt(user.score)}점
                        </p>
                        <p className="text-xs text-gray-500">평균 집중도</p>
                      </div>
                      {getTrendIcon(user.trend)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-bold text-gray-900">BrainBuddy</span>
          </div>
          <p className="text-gray-600">© 2025 BrainBuddy. 모든 권리 보유.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            navigate("/main");
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;
