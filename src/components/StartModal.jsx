import React from "react";
import { X, Play, Clock, MapPin, BookOpen } from "lucide-react";

const StartModal = ({ onClose, onConfirm, sessionData }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">분석 시작</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              집중도 분석을 시작합니다
            </h3>
            <p className="text-gray-600">
              설정한 조건으로 학습 세션을 시작하시겠습니까?
            </p>
          </div>

          {/* Session Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">세션 정보</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">시간:</span>
                <span className="font-medium">{sessionData.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">장소:</span>
                <span className="font-medium">{sessionData.place}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">주제:</span>
                <span className="font-medium">{sessionData.subject}</span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">
              분석 시 주의사항
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 카메라를 정면으로 바라보세요</li>
              <li>• 충분한 조명을 확보해주세요</li>
              <li>• 분석 중에는 자리를 이탈하지 마세요</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>시작하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartModal;
