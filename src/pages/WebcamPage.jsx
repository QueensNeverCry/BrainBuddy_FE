import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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

const WebcamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  // WebSocket
  const socketRef = useRef(null);
  const isConnectedRef = useRef(false);

  // refs for detection / sending
  const faceBoxRef = useRef(null); // latest boundingBox
  const faceDetectionRef = useRef(null);
  const mpCameraRef = useRef(null);
  const sendIntervalRef = useRef(null);
  const reuseCanvasRef = useRef(null);

  // UI state
  const [showTestModal, setShowTestModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [focusScore, setFocusScore] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
  const [nickname, setNickname] = useState("");
  const [focusLevel, setFocusLevel] = useState(0);

  const sessionData = useMemo(() => {
    return (
      location.state || {
        user_name: nickname,
        time: "오후 2:00",
        place: "집",
        subject: "학습",
      }
    );
  }, [location.state, nickname]);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, []);

  // websocket 연결 함수
  const connectWebSocket = useCallback((data) => {
    if (
      isConnectedRef.current ||
      (socketRef.current && socketRef.current.readyState === 1)
    )
      return;

    const ws = new WebSocket(
      // `ws://localhost:8000/ws/focus?user_name=${encodeURIComponent(
      //   localStorage.getItem("nickname")
      // )}`
      `wss://www.brainbuddy.co.kr/ws/real-time?user_name=${encodeURIComponent(
        localStorage.getItem("nickname")
      )}&location=${encodeURIComponent(
        data.place
      )}&subject=${encodeURIComponent(data.subject)}`
    );

    ws.onopen = () => {
      console.log("✅ WebSocket 연결 성공");
      console.log(data);
      isConnectedRef.current = true;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.focus === "number") {
          setFocusLevel(data.focus);
          console.log("📨 서버로부터 집중도 수신: ", data.focus);
        }
      } catch (error) {
        console.error("WebSocket 메시지 파싱 실패:", error);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket 에러:", err);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket 연결 종료");
      isConnectedRef.current = false;
    };

    socketRef.current = ws;
  }, []);

  // session timer + dummy focus generator (1초마다)
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
        // const newFocusScore = Math.floor(Math.random() * 91) + 10; // 10~100
        setFocusScore(focusLevel * 10);
        // setFocusLevel(Math.floor(newFocusScore / 10)); // 0~10
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, focusLevel]);

  // initialize FaceDetection + MediaPipeCamera (single place)
  useEffect(() => {
    // create reusable canvas
    if (!reuseCanvasRef.current) {
      reuseCanvasRef.current = document.createElement("canvas");
    }

    // guard: ensure webcam exists
    if (!webcamRef.current) return;

    // prevent double init
    if (faceDetectionRef.current) return;

    const fd = new FaceDetection({
      locateFile: (file) => `/mediapipe/face_detection/${file}`,
    });

    fd.setOptions({
      model: "short",
      modelSelection: 1,
      minDetectionConfidence: 0.5,
    });

    fd.onResults((results) => {
      try {
        if (results.detections && results.detections.length > 0) {
          const det = results.detections[0];
          // store bounding box (xCenter, yCenter, width, height) normalized
          faceBoxRef.current = det.boundingBox;
        } else {
          faceBoxRef.current = null;
        }
      } catch (e) {
        console.error("onResults 처리 중 오류:", e);
      }
    });

    faceDetectionRef.current = fd;

    // start MediaPipeCamera when video is ready
    const startMediaPipe = () => {
      if (mpCameraRef.current) return;
      if (!webcamRef.current || !webcamRef.current.video) return;

      mpCameraRef.current = new MediaPipeCamera(webcamRef.current.video, {
        onFrame: async () => {
          try {
            await fd.send({ image: webcamRef.current.video });
          } catch (e) {
            // ignore occasional send errors
            console.warn("fd.send error:", e);
          }
        },
        width: 640,
        height: 480,
      });
      try {
        mpCameraRef.current.start();
      } catch (e) {
        console.warn("MediaPipeCamera start failed:", e);
      }
    };

    const video = webcamRef.current.video;
    if (video && video.readyState >= 3) {
      startMediaPipe();
    } else {
      const checker = setInterval(() => {
        if (webcamRef.current?.video?.readyState >= 3) {
          clearInterval(checker);
          startMediaPipe();
        }
      }, 200);
    }

    return () => {
      // cleanup on unmount
      try {
        if (mpCameraRef.current) {
          mpCameraRef.current.stop();
          mpCameraRef.current = null;
        }
      } catch (e) {
        // ignore
        console.warn(e);
      }
      faceDetectionRef.current = null;
      faceBoxRef.current = null;
    };
  }, []); // mount once

  // send loop: independent 3fps sender using latest faceBoxRef
  useEffect(() => {
    // clear any previous interval if stopping
    if (!isRecording) {
      if (sendIntervalRef.current) {
        clearInterval(sendIntervalRef.current);
        sendIntervalRef.current = null;
      }
      return;
    }

    // ensure websocket connection is ready (connect if not)
    // if (!socketRef.current || socketRef.current.readyState !== 1) {
    //   connectWebSocket();
    // }

    const canvas = reuseCanvasRef.current || document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    sendIntervalRef.current = setInterval(() => {
      const video = webcamRef.current?.video;
      const box = faceBoxRef.current;
      const ws = socketRef.current;

      if (!video || !box || !ws || ws.readyState !== 1) {
        return;
      }

      // Convert normalized bbox to pixel coords and clamp
      const videoWidth = video.videoWidth || video.width || 640;
      const videoHeight = video.videoHeight || video.height || 480;

      const x = Math.max(
        0,
        Math.floor((box.xCenter - box.width / 2) * videoWidth)
      );
      const y = Math.max(
        0,
        Math.floor((box.yCenter - box.height / 2) * videoHeight)
      );
      const w = Math.max(16, Math.floor(box.width * videoWidth));
      const h = Math.max(16, Math.floor(box.height * videoHeight));

      // defensive: ensure within bounds
      const xClamped = Math.min(videoWidth - 1, x);
      const yClamped = Math.min(videoHeight - 1, y);
      const wClamped = Math.min(videoWidth - xClamped, w);
      const hClamped = Math.min(videoHeight - yClamped, h);

      canvas.width = wClamped;
      canvas.height = hClamped;

      try {
        ctx.drawImage(
          video,
          xClamped,
          yClamped,
          wClamped,
          hClamped,
          0,
          0,
          wClamped,
          hClamped
        );
      } catch (e) {
        console.warn("drawImage 실패:", e);
        return;
      }

      canvas.toBlob(
        (blob) => {
          if (blob && ws.readyState === 1) {
            try {
              ws.send(blob);
              console.log(
                "이미지 전송:",
                blob.size,
                "bytes",
                new Date().toISOString()
              );
            } catch (e) {
              console.error("WebSocket send 실패:", e);
            }
          }
        },
        "image/jpeg",
        0.7
      );
    }, 333); // ~3fps

    return () => {
      if (sendIntervalRef.current) {
        clearInterval(sendIntervalRef.current);
        sendIntervalRef.current = null;
      }
    };
  }, [connectWebSocket, isRecording]);

  // ensure websocket closed when unmount
  useEffect(() => {
    return () => {
      if (sendIntervalRef.current) {
        clearInterval(sendIntervalRef.current);
        sendIntervalRef.current = null;
      }
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch (e) {
          console.log(e);
        }
        socketRef.current = null;
      }
      // stop mediapipe if mounted
      try {
        if (mpCameraRef.current) {
          mpCameraRef.current.stop();
          mpCameraRef.current = null;
        }
      } catch (e) {
        console.error(e);
      }
    };
  }, []);

  const handleStartRecording = () => {
    setShowStartModal(true);
  };

  const confirmStart = () => {
    // ensure websocket connected then start
    connectWebSocket(sessionData);
    setIsRecording(true);
    setShowStartModal(false);
  };

  const handleEndRecording = () => {
    setShowEndModal(true);
  };

  const confirmEnd = async () => {
    setIsRecording(false);

    // clear the sender interval explicitly
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }

    // close socket
    if (socketRef.current) {
      try {
        socketRef.current.close();
        isConnectedRef.current = false;
      } catch (e) {
        console.warn("socket close error", e);
      }
      socketRef.current = null;
    }

    try {
      const res = await fetch(
        "https://www.brainbuddy.co.kr/api/dashboard/recent-report/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`API 요청 실패: ${res.status}`);
      }

      const data = await res.json();
      console.log("📨 백엔드 응답:", data);

      const result = {
        score: data.final_score,
        duration: formatTime(sessionTime),
        subject: sessionData.subject,
        place: sessionData.place,
        time: sessionData.time,
        date: new Date().toLocaleDateString("ko-KR"),
        details: {
          avgFocus: data.avg_focus,
          maxFocus: data.max_focus,
          minFocus: data.min_focus,
          distractions: Math.floor(Math.random() * 5) + 1,
        },
        grade: data.final_grade,
        ment: data.final_ment,
      };

      setSessionResult(result);
      setShowEndModal(false);
      setShowResultModal(true);
    } catch (error) {
      console.log("종료 API 호출 중 오류:", error);
      alert("결과를 불러오는데 실패했습니다.");
    }
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
                <div className="flex items-end justify-center space-x-1 h-32">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const blockNumber = idx + 1; // 1~10
                    let color = "bg-gray-200"; // 기본 연한 회색

                    if (blockNumber <= focusLevel) {
                      if (focusLevel <= 4) color = "bg-emerald-200";
                      else if (focusLevel <= 7) color = "bg-emerald-300";
                      else color = "bg-emerald-400";
                    }

                    return (
                      <div
                        key={idx}
                        className={`${color} w-4 rounded-t`}
                        style={{
                          height: `${(blockNumber / 10) * 100}%`,
                          transition: "background-color 0.3s ease",
                        }}
                      />
                    );
                  })}
                </div>
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
                    <span className="text-gray-600">현재 집중도</span>
                    <span
                      className={`font-medium ${getFocusColor(focusScore)}`}
                    >
                      {Math.round(focusScore)}%
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
