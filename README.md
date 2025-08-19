<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->

# 🧠 BrainBuddy - 뇌친구, 내친구

당신의 집중을 실시간으로 측정하고, 데이터로 완성하는 똑똑한 학습 동반자

---

## 📌 프로젝트 소개

**BrainBuddy**는 웹캠을 통해 사용자의 얼굴을 인식하고, 집중도를 실시간으로 분석하여 학습자의 효율적인 학습을 돕는 웹 애플리케이션입니다.  
사용자는 학습 계획을 세우고, 학습 중 집중 상태를 그래프 및 게이지로 확인하며, 데이터 기반의 학습 개선 효과를 경험할 수 있습니다.

---

## ⚙️ Tech Stack

### 🎨 Front-end

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/ContextAPI-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/ReactRouter-CA4245?style=for-the-badge&logo=react-router&logoColor=white"/>
  <img src="https://img.shields.io/badge/LucideReact-000000?style=for-the-badge&logo=lucide&logoColor=white"/>
  <img src="https://img.shields.io/badge/Mediapipe-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/FetchAPI-FFCA28?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white"/>
</p>

---

## 💻 개발 환경

<p>
  <img src="https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white"/>
  <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"/>
  <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>
</p>

---

## 📂 폴더 구조

```bash
BrainBuddy_FE/
├── README.md           # 프로젝트 설명 문서
├── public/             # 정적 리소스
│   ├── mediapipe/      # Mediapipe 관련 리소스
│   └── vite.svg
├── src/                # 소스 코드
│   ├── api/            # API 통신 모듈 (Auth 등)
│   │   ├── AuthApi.jsx
│   │   └── AuthApi2.jsx
│   ├── assets/         # 아이콘, 이미지 등 에셋
│   ├── components/     # 공통 컴포넌트 (모달 등)
│   │   ├── AuthModal.jsx
│   │   ├── EndModal.jsx
│   │   ├── ReportModal.jsx
│   │   ├── ResultModal.jsx
│   │   ├── StartModal.jsx
│   │   ├── TestModal.jsx
│   │   ├── TutorialModal.jsx
│   │   └── UserModal.jsx
│   ├── pages/          # 주요 페이지
│   │   ├── AccountDeletion.jsx
│   │   ├── LandingPage.jsx
│   │   ├── MainPage.jsx
│   │   └── WebcamPage.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json        # 의존성 관리
├── index.html          # SPA 진입점
└── 기타 설정 파일       # eslint, postcss, gitignore 등


## 🖥 주요 기능

### 🔑 회원 인증
- 회원가입 / 로그인 API 연동
- JWT Access & Refresh Token 발급 및 브라우저 쿠키 저장

### 🏠 메인 페이지
- 학습 계획 설정 (언제 / 어디서 / 무엇을)
- 학습 시작 버튼 클릭 시 **웹캠 페이지 이동**

### 📷 웹캠 페이지
- Mediapipe Face Detection 기반 얼굴 인식
- Crop된 얼굴 데이터를 **WebSocket**을 통해 초저지연 전송
- 실시간 집중도 게이지 및 트렌드 그래프 제공
```
