import React from "react";
import { X, Square, AlertTriangle } from "lucide-react";

const EndModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">분석 종료</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              정말 종료하시겠습니까?
            </h3>
            <p className="text-gray-600">
              현재까지의 분석 데이터가 저장되고 결과 리포트를 확인할 수
              있습니다.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">종료 시 주의사항</p>
                <p>
                  분석을 중단하면 현재 세션의 데이터가 저장되며, 이후 수정할 수
                  없습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              계속하기
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>종료하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndModal;
