import React, { useState } from "react";
import { X, Camera, Check, AlertCircle } from "lucide-react";

const TestModal = ({ onClose }) => {
  const [step, setStep] = useState("permission"); // permission, testing, complete

  const handlePermissionGranted = () => {
    setStep("testing");
    // 3초 후 자동으로 완료 단계로 이동
    setTimeout(() => {
      setStep("complete");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">카메라 테스트</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {step === "permission" && (
            <div className="text-center">
              <Camera className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                카메라 권한이 필요합니다
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                집중도 분석을 위해 웹캠 접근 권한을 허용해주세요. 촬영된 영상은
                분석 후 즉시 삭제됩니다.
              </p>
              <div className="space-y-3 mb-6 text-sm text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-gray-600">실시간 얼굴 표정 분석</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-gray-600">개인정보 보호 보장</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-gray-600">분석 완료 후 자동 삭제</p>
                </div>
              </div>
              <button
                onClick={handlePermissionGranted}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                권한 허용하기
              </button>
            </div>
          )}

          {step === "testing" && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <Camera className="w-8 h-8 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                카메라를 테스트하고 있습니다
              </h3>
              <p className="text-gray-600 mb-4">잠시만 기다려주세요...</p>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  💡 카메라가 정면을 향하고 얼굴이 잘 보이는지 확인해주세요
                </p>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                테스트 완료!
              </h3>
              <p className="text-gray-600 mb-6">
                카메라가 정상적으로 작동합니다. 이제 집중도 분석을 시작할 수
                있어요.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  닫기
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  시작하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestModal;
