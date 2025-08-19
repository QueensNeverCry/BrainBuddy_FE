import React from "react";
import { X, Award, TrendingUp, Clock, Target, Share2 } from "lucide-react";

const ResultModal = ({ result, onClose }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">분석 완료!</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Award className="w-12 h-12 text-white" />
            </div>
            <div
              className={`text-5xl font-bold mb-2 ${getScoreColor(
                result.score
              )}`}
            >
              {result.score}
            </div>
            <div
              className={`text-2xl font-bold mb-3 ${getScoreColor(
                result.score
              )}`}
            >
              {result.grade} 등급
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {result.ment}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  result.score >= 80
                    ? "bg-green-500"
                    : result.score >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Session Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">학습 시간</p>
              <p className="font-bold text-blue-600">{result.duration}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">주제</p>
              <p className="font-bold text-purple-600">{result.subject}</p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">상세 분석</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">평균 집중도</span>
                <span className="font-medium text-emerald-600">
                  {result.details.avgFocus}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">최고 집중도</span>
                <span className="font-medium text-green-600">
                  {result.details.maxFocus}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">최저 집중도</span>
                <span className="font-medium text-red-600">
                  {result.details.minFocus}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">집중 방해 횟수</span>
                <span className="font-medium text-orange-600">
                  {result.details.distractions}회
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 border-2 border-emerald-600 text-emerald-600 py-3 rounded-xl font-medium hover:bg-emerald-50 transition-colors duration-200 flex items-center justify-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>공유하기</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>대시보드로</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
