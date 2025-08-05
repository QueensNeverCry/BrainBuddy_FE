import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";

const TutorialModal = ({ onClose, onHideNextTime }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hideNextTime, setHideNextTime] = useState(false);

  const steps = [
    {
      title: "BrainBuddy에 오신 것을 환영합니다!",
      content: "AI 기술로 당신의 집중도를 분석하고 학습 효율을 높여보세요.",
      image: "🧠",
    },
    {
      title: "사용자 맞춤 학습 설정",
      content: "언제, 어디서, 무엇을 학습할지 선택하여 맞춤형 분석을 받으세요.",
      image: "⚙️",
    },
    {
      title: "실시간 집중도 측정",
      content:
        "웹캠을 통해 실시간으로 집중도를 분석하고, 즉시 피드백을 받으세요.",
      image: "📊",
    },
    {
      title: "상세한 분석 리포트",
      content: "학습 후 상세한 집중도 리포트와 개선 방안을 확인하세요.",
      image: "📈",
    },
    {
      title: "랭킹과 경쟁",
      content: "다른 사용자들과 집중력을 비교하고 동기부여를 받으세요.",
      image: "🏆",
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (hideNextTime) {
      onHideNextTime();
    } else {
      onClose();
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-emerald-600">
              {currentStep + 1}/{steps.length}
            </span>
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index <= currentStep ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="text-6xl mb-6">{steps[currentStep].image}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {steps[currentStep].content}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          {isLastStep && (
            <div className="flex items-center justify-center mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideNextTime}
                  onChange={(e) => setHideNextTime(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">다음에 보지 않기</span>
              </label>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>이전</span>
            </button>

            {isLastStep ? (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
              >
                <Check className="w-5 h-5" />
                <span>시작하기</span>
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
              >
                <span>다음</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
