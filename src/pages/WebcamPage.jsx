import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import {
  Camera,
  Play,
  Square,
  TestTube,
  ArrowLeft,
  Eye,
  Brain,
} from "lucide-react";
import TestModal from "../components/TestModal";
import StartModal from "../components/StartModal";
import EndModal from "../components/EndModal";
import ResultModal from "../components/ResultModal";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera as MediaPipeCamera } from "@mediapipe/camera_utils";
import { SessionContext } from "../contexts/SessionContext";

const WebcamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  // 추적용 이미지 전송 타이머 Ref
  const imageSendIntervalRef = useRef(null);
  // 얼굴 영역 저장용 Ref
  const faceDetection = useRef(null);
  const { selectedTime, selectedPlace, selectedSubject, addReport } =
    useContext(SessionContext);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [focusScore, setFocusScore] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);

  useEffect(() => {
    if (location.state) {
      localStorage.setItem("sessionData", JSON.stringify(location.state));
    }
  }, [location.state]);

  const sessionData = {
    time: selectedTime,
    place: selectedPlace,
    subject: selectedSubject,
  };

  // const sessionData = location.state ||
  //   JSON.parse(localStorage.getItem("sessionData")) || {
  //     time: "오후 2:00",
  //     place: "집",
  //     subject: "학습",
  //   };

  // 매개변수 이름도 'file'로 수정
  const sendCroppedFaceImage = (file) => {
    const formData = new FormData();
    formData.append("file", file, "face.jpg");

    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        console.log("이미지 전송 성공:", res.status);
      })
      .catch((err) => {
        console.error("이미지 전송 실패:", err);
      });
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
        // 더미 집중도 점수 시뮬레이션 (실제로는 AI 분석 결과)
        setFocusScore((prev) =>
          Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5))
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // 얼굴 인식 초기화
  useEffect(() => {
    if (!webcamRef.current) return;

    const faceDetection = new FaceDetection({
      locateFile: (file) => `/mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: "short",
      modelSelection: 1,
      minDetectionConfidence: 0.5,
    });

    faceDetection.onResults((results) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (
        results.detections &&
        results.detections.length > 0 &&
        webcamRef.current &&
        webcamRef.current.video
      ) {
        const detection = results.detections[0];
        const { xCenter, yCenter, width, height } = detection.boundingBox;

        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        const x = (xCenter - width / 2) * videoWidth;
        const y = (yCenter - height / 2) * videoHeight;
        const w = width * videoWidth;
        const h = height * videoHeight;

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(video, x, y, w, h, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const imageFile = new File([blob], `face_${Date.now()}.jpg`, {
                type: "image/jpeg",
              });

              // 파일 전송 큐에 저장
              if (isRecording) sendCroppedFaceImage(imageFile);
            }
          },
          "image/jpeg",
          0.95
        );
      }
    });
    let camera;

    const startCamera = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState >= 3
      ) {
        camera = new MediaPipeCamera(webcamRef.current.video, {
          onFrame: async () => {
            await faceDetection.send({ image: webcamRef.current.video });
          },
          width: 640,
          height: 480,
        });
        camera.start();
      } else {
        // 비디오가 준비될 때까지 기다렸다가 시작
        const checkInterval = setInterval(() => {
          if (
            webcamRef.current &&
            webcamRef.current.video &&
            webcamRef.current.video.readyState >= 3
          ) {
            clearInterval(checkInterval);
            camera = new MediaPipeCamera(webcamRef.current.video, {
              onFrame: async () => {
                await faceDetection.send({ image: webcamRef.current.video });
              },
              width: 640,
              height: 480,
            });
            camera.start();
          }
        }, 500);
      }
    };

    startCamera();

    return () => {
      if (camera) camera.stop();
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setShowStartModal(true);
  };

  const confirmStart = () => {
    setIsRecording(true);
    setFocusScore(75 + Math.random() * 20); // 초기 점수
    setShowStartModal(false);

    imageSendIntervalRef.current = setInterval(() => {
      if (webcamRef.current && webcamRef.current.video) {
        faceDetection.send({ image: webcamRef.current.video });
      }
    }, 333); // 1000ms / 3
  };

  const handleEndRecording = () => {
    setShowEndModal(true);
  };

  const confirmEnd = () => {
    setIsRecording(false);
    clearInterval(imageSendIntervalRef.current);
    const finalScore = focusScore;
    const duration = sessionTime;
    const result = {
      score: Math.round(finalScore * 10) / 10,
      duration: formatTime(duration),
      subject: sessionData.subject,
      place: sessionData.place,
      time: sessionData.time,
      date: new Date().toLocaleDateString("ko-KR"),
      details: {
        avgFocus: Math.round(finalScore * 10) / 10,
        maxFocus: Math.round((finalScore + 10) * 10) / 10,
        minFocus: Math.round((finalScore - 10) * 10) / 10,
        distractions: Math.floor(Math.random() * 5) + 1,
      },
    };

    addReport(result);
    setSessionResult(result);
    setShowEndModal(false);
    setShowResultModal(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getFocusColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getFocusLevel = (score) => {
    if (score >= 90) return "매우 높음";
    if (score >= 80) return "높음";
    if (score >= 70) return "보통";
    if (score >= 60) return "낮음";
    return "매우 낮음";
  };

  // 집중도
  const renderFocusIndicator = () => {
    const blockScore = Math.round(focusScore / 10);

    return (
      <div className="text-center">
        <div className="flex justify-center gap-1 mb-2">
          {Array.from({ length: 10 }, (_, i) => {
            const level = i + 1;
            let color = "bg-gray-200";
            if (blockScore >= 8 && level <= blockScore) color = "bg-[#729076]";
            else if (blockScore >= 5 && level <= blockScore)
              color = "bg-[#ADCFA5]";
            else if (blockScore > 0 && level <= blockScore)
              color = "bg-[#D8E5D4]";
            return (
              <div key={level} className={`${color} w-5 h-5 rounded`}></div>
            );
          })}
        </div>
        <p className="text-sm font-medium text-gray-700">
          {focusScore <= 40
            ? "지금 집중이 흐트러졌어요 ⚠️"
            : focusScore <= 70
            ? "집중을 유지해보세요 💡"
            : "아주 잘 집중하고 있어요! 🔥"}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/main")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-emerald-600" />
                <span className="text-2xl font-bold text-gray-900">
                  BrainBuddy
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isRecording && (
                <div className="flex items-center space-x-2 bg-red-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 font-medium">녹화 중</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Session Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            집중도 분석 세션
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">시간:</span>
              <span className="text-gray-900">{sessionData.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">장소:</span>
              <span className="text-gray-900">{sessionData.place}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">주제:</span>
              <span className="text-gray-900">{sessionData.subject}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Webcam Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6">
                <Webcam
                  ref={webcamRef}
                  className="w-full h-full object-cover"
                  mirrored={true}
                />
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>REC {formatTime(sessionTime)}</span>
                  </div>
                )}
                {isRecording && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span
                        className={`font-bold ${getFocusColor(focusScore)}`}
                      >
                        {Math.round(focusScore)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowTestModal(true)}
                  disabled={isRecording}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-6 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TestTube className="w-5 h-5" />
                  <span>촬영 전 테스트하기</span>
                </button>

                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>시작하기</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEndRecording}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Square className="w-5 h-5" />
                    <span>종료하기</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Current Focus */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                실시간 집중도
              </h3>
              {isRecording ? (
                renderFocusIndicator()
              ) : (
                <div className="text-center text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>
                    분석을 시작하려면
                    <br />
                    시작하기 버튼을 눌러주세요
                  </p>
                </div>
              )}
            </div>

            {/* Session Stats */}
            {isRecording && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  세션 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">진행 시간</span>
                    <span className="font-medium">
                      {formatTime(sessionTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">학습 주제</span>
                    <span className="font-medium">{sessionData.subject}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                💡 집중도 향상 팁
              </h3>
              <ul className="text-sm text-emerald-700 space-y-2">
                <li>• 카메라를 정면으로 바라보세요</li>
                <li>• 밝은 조명에서 촬영하세요</li>
                <li>• 주변 소음을 최소화하세요</li>
                <li>• 정기적으로 휴식을 취하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTestModal && <TestModal onClose={() => setShowTestModal(false)} />}

      {showStartModal && (
        <StartModal
          onClose={() => setShowStartModal(false)}
          onConfirm={confirmStart}
          sessionData={sessionData}
        />
      )}

      {showEndModal && (
        <EndModal
          onClose={() => setShowEndModal(false)}
          onConfirm={confirmEnd}
        />
      )}

      {showResultModal && sessionResult && (
        <ResultModal
          result={sessionResult}
          onClose={() => {
            setShowResultModal(false);
            navigate("/main");
          }}
        />
      )}
    </div>
  );
};

export default WebcamPage;
