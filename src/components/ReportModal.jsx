import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  TrendingUp,
  Eye,
  AlertTriangle,
} from "lucide-react";

const ReportModal = ({ report, onClose }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "D";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            집중도 분석 리포트
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Session Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">날짜</p>
                  <p className="font-medium">{report.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">시간</p>
                  <p className="font-medium">{report.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">장소</p>
                  <p className="font-medium">{report.place}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">주제</p>
                  <p className="font-medium">{report.subject}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="text-center mb-8">
            <div
              className={`text-6xl font-bold mb-2 ${getScoreColor(
                report.score
              )}`}
            >
              {report.score}
            </div>
            <div
              className={`text-2xl font-bold mb-2 ${getScoreColor(
                report.score
              )}`}
            >
              {getScoreGrade(report.score)} 등급
            </div>
            <p className="text-gray-600">전체 집중도 점수</p>
            <div className="mt-4 mx-auto max-w-xs bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  report.score >= 80
                    ? "bg-green-500"
                    : report.score >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${report.score}%` }}
              ></div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">집중도 변화</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">평균 집중도</span>
                  <span className="font-medium text-blue-600">
                    {report.details?.avgFocus || report.score}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">최고 집중도</span>
                  <span className="font-medium text-green-600">
                    {report.details?.maxFocus || report.score + 10}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">최저 집중도</span>
                  <span className="font-medium text-red-600">
                    {report.details?.minFocus || report.score - 10}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Eye className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900">학습 성과</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">학습 시간</span>
                  <span className="font-medium">{report.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">집중 방해 횟수</span>
                  <span className="font-medium text-orange-600">
                    {report.details?.distractions || 2}회
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">효율성 지수</span>
                  <span className="font-medium text-emerald-600">
                    {Math.round(report.score * 0.9)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-800">개선 제안</h3>
            </div>
            <div className="space-y-3 text-sm text-emerald-700">
              {report.score >= 90 ? (
                <>
                  <p>
                    • 뛰어난 집중력을 보여주셨습니다! 현재 패턴을 유지하세요.
                  </p>
                  <p>• 더 도전적인 학습 목표를 설정해보시는 것을 추천합니다.</p>
                </>
              ) : report.score >= 80 ? (
                <>
                  <p>
                    • 좋은 집중력을 보여주셨습니다. 조금 더 향상시킬 수 있어요.
                  </p>
                  <p>• 학습 환경의 조명과 소음을 점검해보세요.</p>
                </>
              ) : report.score >= 70 ? (
                <>
                  <p>• 평균적인 집중력입니다. 몇 가지 개선점이 있어요.</p>
                  <p>• 25분 집중 + 5분 휴식의 포모도로 기법을 시도해보세요.</p>
                </>
              ) : (
                <>
                  <p>• 집중력 향상이 필요합니다. 환경 요소를 점검해보세요.</p>
                  <p>• 더 짧은 시간 단위로 학습을 시작해보시기 바랍니다.</p>
                </>
              )}
              <p>
                • 다음 학습 시에는 {report.place}에서의 환경을 최적화해보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
