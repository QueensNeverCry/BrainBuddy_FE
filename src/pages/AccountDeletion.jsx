import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const AccountDeletion = () => {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAccountDeletion = async () => {
    if (confirmText !== "계정 삭제") return;

    setIsDeleting(true);

    try {
      // const response = await fetch("https://localhost:8443/api/auth/withdraw", {
      const response = await fetch("http://localhost:8500/api/auth/withdraw", {
        method: "DELETE",
        credentials: "include", // BB_ACCESS_TOKEN 포함
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          user_pw: password,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // 삭제 성공
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("nickname");

        alert("계정이 성공적으로 삭제되었습니다.");
        navigate("/");
      } else {
        // 삭제 실패
        alert(data.message || data.detail || "계정 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("계정 삭제 중 에러 발생:", error);
      alert("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            대시보드로 돌아가기
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">계정 삭제</h1>
                <p className="text-gray-600">
                  계정을 완전히 삭제하려면 아래 안내를 확인하세요.
                </p>
              </div>
            </div>

            {/* 계정 삭제 주의사항 */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">
                계정 삭제 주의사항
              </h3>
              <ul className="text-red-700 space-y-2">
                <li>이 계정으로 작성한 모든 게시글이 삭제됩니다.</li>
                <li>이 계정으로 만든 모든 설정이 초기화됩니다.</li>
                <li>저장된 모든 데이터가 영구적으로 삭제됩니다.</li>
                <li>삭제 후 계정 복구는 불가능합니다.</li>
              </ul>
            </div>

            <div className="space-y-6">
              {/* 이메일 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {/* 계정 삭제를 확인하려면 <strong>"계정 삭제"</strong>를
                  입력하세요: */}
                  이메일
                </label>
                <input
                  type="eamil"
                  // value={confirmText}
                  value={email}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="삭제할 계정 이메일 입력"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="계정 비밀번호 입력"
                />
              </div>

              {/* 삭제 확인 텍스트 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  계정 삭제를 확인하려면 <strong>"계정 삭제"</strong>를
                  입력하세요:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="계정 삭제"
                />
              </div>

              <div className="flex space-x-4">
                <Link
                  to="/main"
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-center"
                >
                  취소
                </Link>
                <button
                  onClick={handleAccountDeletion}
                  disabled={confirmText !== "계정 삭제" || isDeleting}
                  className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors ${
                    confirmText === "계정 삭제" && !isDeleting
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isDeleting ? "삭제 중..." : "계정 삭제"}
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>주의:</strong>
                <br />
                계정 삭제 시 저장된 모든 정보가 완전히 삭제되며, 복구할 수
                없습니다. 신중하게 진행하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletion;
