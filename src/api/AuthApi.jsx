export const getAccessToken = () => localStorage.getItem("access");
export const getRefreshToken = () => localStorage.getItem("refresh");
export const setTokens = (accessToken) => {
  localStorage.setItem("access", accessToken);
  // localStorage.setItem("refresh", refreshToken);
};

// ❗ refreshToken은 HttpOnly 쿠키에만 있어야 함. JS에 저장하는 건 XSS 위험 있음.

// const API_BASE_URL = "https://localhost:8443/api";
const API_BASE_URL = "http://localhost:8500/api";

// 쿠키 기반 JWT 관리 함수
export const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("nickname");
};

// JWT Access 토큰 refresh 함수
export async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // HttpOnly 쿠키 전송
      headers: {
        "Content-Type": "application/json",
      },
    });
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //   },
    //   credentials: "include", // HttpOnly 쿠키 자동 전송
    // });

    const data = await response.json();

    if (data?.body?.status === "success") {
      // const { accessToken, refreshToken, user_name } = data.body;
      // // 이게 없으면 localStorage에 아무 토큰도 저장되지 않음
      setTokens(accessToken); // 반드시 새 토큰 저장
      console.log("🤖🤖🤖[JWT] Refresh 성공🤖🤖🤖");
      return true; // refresh 성공
    } else if (data?.body?.code === "LOGIN_AGAIN") {
      // 로그인이 필요함
      clearTokens();
      alert("세션이 만료되어 다시 로그인해야 합니다.");
      window.location.href = "/"; // 로그인 화면으로 redirect
      return false;
    } else {
      // 토큰이 유효하지 않음
      clearTokens();
      alert("인증에 실패했습니다. 메인화면으로 이동합니다.");
      window.location.href = "/"; // LandingPage로 redirect
      return false;
    }
  } catch (error) {
    console.error("😭😭Refresh 요청 실패:", error);
    clearTokens();
    alert("서버 오류로 인증을 처리할 수 없습니다. 메인화면으로 이동합니다.");
    window.location.href = "/"; // LandingPage로 redirect
    return false;
  }
}

// 쿠키 기반 자동 Refresh fetch
export async function fetchWithAutoRefresh(url, options = {}, retry = true) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include", // HttpOnly 쿠키 전송
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await response.json();

    // 401 혹은 토큰 만료 처리
    if (
      (response.status === 401 || data?.body?.code === "TOKEN_EXPIRED") &&
      retry
    ) {
      console.log("⚠️ Access Token 만료 감지, refresh 호출");

      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      const refreshData = await refreshRes.json();

      if (refreshRes.ok && refreshData?.body?.code === "success") {
        // console.log("🤖 Access Token 재발급 성공, 재요청");
        const newAccessToken = refreshData.body.accessToken;
        setTokens(newAccessToken);
        return await fetchWithAutoRefresh(url, options, false);
      } else {
        console.warn("🗝️ Refresh 실패, 재로그인 필요");
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/";
        return;
      }
    }

    // 기타 body.code 기반 오류 처리
    if (data?.body?.code && data.body.code !== "success") {
      console.warn(
        `[API ERROR] code=${data.body.code}, message=${data.message}`
      );
      if (data.body.code === "LOGIN_AGAIN") {
        alert("세션 만료. 다시 로그인 필요");
        window.location.href = "/";
      } else if (data.body.code === "TOKEN_INVALID") {
        alert("토큰 유효하지 않음. 메인화면 이동");
        window.location.href = "/";
      }
    }

    return data;
  } catch (err) {
    console.error("❌ fetchWithAutoRefresh 에러:", err);
    throw err;
  }
}

//     // 401 혹은 TOKEN_EXPIRED 처리
//     if (
//       (response.status === 401 || data?.body?.code === "TOKEN_EXPIRED") &&
//       retry
//     ) {
//       console.log("⚠️⚠️[JWT] Access Token 만료 감지, refresh 호출");

//       const refreshSuccess = await refreshAccessToken();

//       // 401 Unauthorized - 토큰 만료로 판단
//       if (refreshSuccess) {
//         // 재요청
//         return await fetchWithAutoRefresh(url, options, false);
//       } else {
//         throw new Error("🗝️🗝️Refresh 실패, 재로그인 필요");
//       }
//     }

//     // body.code 기반 실패 처리
//     if (data?.body?.code && data.body.code !== "success") {
//       console.warn(
//         `[API ERROR] code=${data.body.code}, message=${data.message}`
//       );
//       if (data.body.code === "LOGIN_AGAIN") {
//         clearTokens();
//         alert("세션이 만료되어 다시 로그인해야 합니다.");
//         window.location.href = "/";
//       } else if (data.body.code === "TOKEN_INVALID") {
//         clearTokens();
//         alert("토큰이 유효하지 않습니다. 메인화면으로 이동합니다.");
//         window.location.href = "/";
//       }
//     }
//     return data;
//   } catch (err) {
//     console.error("❌❌fetchWithAutoRefresh 에러:", err);
//     throw err;
//   }
// }

// 회원가입 API
export async function signUp(userData) {
  const { email, user_name, user_pw, user_pw_confirm } = userData;

  const res = await fetch(`${API_BASE_URL}/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      user_name,
      user_pw,
      user_pw_confirm,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "회원가입에 실패했습니다.");
  }

  return data;
}

//
// export async function fetchTutorialSkip(reportId) {
//   return await fetchWithAutoRefresh(
//     `https://localhost:8443/api/users/tutorial-skip`,
//     {
//       method: "POST",
//       body: JSON.stringify({ report_id: reportId }),
//     }
//   );
// }

// 쿠키 기반 인증을 위한 fetch 함수
export async function fetchWithCookies(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.detail || `Request failed: ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error("❌❌fetchWithCookies 실패: ", error);
    throw error;
  }
}
