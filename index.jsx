import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  bg: "#0A0E1A",
  bgCard: "#0F1628",
  bgCardHover: "#141C35",
  border: "rgba(99,130,255,0.15)",
  borderHover: "rgba(99,130,255,0.35)",
  accent: "#6382FF",
  accentLight: "#8FA4FF",
  accentDark: "#4A62D8",
  danger: "#FF4D6A",
  dangerBg: "rgba(255,77,106,0.1)",
  success: "#00D68F",
  successBg: "rgba(0,214,143,0.1)",
  warning: "#FFB547",
  warningBg: "rgba(255,181,71,0.1)",
  text: "#E8ECFF",
  textMuted: "#8892B0",
  textDim: "#4A5568",
  purple: "#A78BFA",
  purpleBg: "rgba(167,139,250,0.1)",
};

const INITIAL_DATA = {
  users: [
    { id: 1, username: "admin", email: "admin@examsentinel.io", password: "admin123", role: "admin", name: "Dr. Sarah Chen" },
    { id: 2, username: "qmanager", email: "qm@examsentinel.io", password: "qm123", role: "qmanager", name: "Prof. Alex Rivera" },
    { id: 3, username: "student1", email: "john@student.edu", password: "pass123", role: "student", name: "John Smith" },
    { id: 4, username: "student2", email: "maya@student.edu", password: "pass123", role: "student", name: "Maya Patel" },
    { id: 5, username: "student3", email: "leo@student.edu", password: "pass123", role: "student", name: "Leo Chen" },
  ],
  exams: [
    { id: 1, title: "Advanced Mathematics", duration: 60, created_by: 2, status: "active", totalQ: 5 },
    { id: 2, title: "Computer Science Fundamentals", duration: 45, status: "active", totalQ: 5 },
    { id: 3, title: "Physics Mechanics", duration: 90, status: "draft", totalQ: 3 },
  ],
  questions: [
    { id: 1, exam_id: 1, text: "What is the derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], correct: 0 },
    { id: 2, exam_id: 1, text: "Solve: ∫x² dx", options: ["x³/3 + C", "2x + C", "x²/2 + C", "3x³ + C"], correct: 0 },
    { id: 3, exam_id: 1, text: "What is the limit of (sin x)/x as x→0?", options: ["0", "1", "∞", "undefined"], correct: 1 },
    { id: 4, exam_id: 1, text: "Which theorem states every bounded sequence has a convergent subsequence?", options: ["Rolle's", "Bolzano-Weierstrass", "Cauchy", "Heine-Borel"], correct: 1 },
    { id: 5, exam_id: 1, text: "What is the Euler number e approximately equal to?", options: ["3.14159", "2.71828", "1.61803", "1.41421"], correct: 1 },
    { id: 6, exam_id: 2, text: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Core Processing Utility", "Central Program Unit"], correct: 0 },
    { id: 7, exam_id: 2, text: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Tree"], correct: 1 },
    { id: 8, exam_id: 2, text: "What is Big O notation for binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2 },
    { id: 9, exam_id: 2, text: "Which language is used for web styling?", options: ["HTML", "JavaScript", "Python", "CSS"], correct: 3 },
    { id: 10, exam_id: 2, text: "What does RAM stand for?", options: ["Read Access Memory", "Random Access Memory", "Rapid Array Memory", "Read Array Module"], correct: 1 },
    { id: 11, exam_id: 3, text: "Newton's first law states an object in motion stays in motion unless acted upon by a:", options: ["Gravitational force", "Net external force", "Friction force", "Normal force"], correct: 1 },
    { id: 12, exam_id: 3, text: "What is the unit of force in SI?", options: ["Joule", "Watt", "Newton", "Pascal"], correct: 2 },
    { id: 13, exam_id: 3, text: "Which formula represents kinetic energy?", options: ["mgh", "½mv²", "mv", "F·d"], correct: 1 },
  ],
  sessions: [],
  activityLogs: [
    { id: 1, student_id: 3, studentName: "John Smith", action: "exam_started", exam: "Advanced Mathematics", timestamp: new Date(Date.now() - 1200000) },
    { id: 2, student_id: 4, studentName: "Maya Patel", action: "tab_switch", exam: "Computer Science Fundamentals", timestamp: new Date(Date.now() - 900000) },
    { id: 3, student_id: 3, studentName: "John Smith", action: "fullscreen_exit", exam: "Advanced Mathematics", timestamp: new Date(Date.now() - 600000) },
    { id: 4, student_id: 5, studentName: "Leo Chen", action: "exam_started", exam: "Advanced Mathematics", timestamp: new Date(Date.now() - 300000) },
  ],
  results: [],
};

const ACTIVE_STUDENTS = [
  { id: 3, name: "John Smith", exam: "Advanced Mathematics", progress: 3, total: 5, warnings: 1, status: "active", cameraOn: true, startTime: new Date(Date.now() - 1200000) },
  { id: 4, name: "Maya Patel", exam: "Computer Science Fundamentals", progress: 2, total: 5, warnings: 2, status: "active", cameraOn: true, startTime: new Date(Date.now() - 900000) },
  { id: 5, name: "Leo Chen", exam: "Advanced Mathematics", progress: 1, total: 5, warnings: 0, status: "active", cameraOn: false, startTime: new Date(Date.now() - 300000) },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body, #root {
  background: #0A0E1A;
  color: #E8ECFF;
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
}

.font-display { font-family: 'Syne', sans-serif; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(99,130,255,0.3); border-radius: 4px; }

.glow-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #00D68F;
  box-shadow: 0 0 8px #00D68F, 0 0 16px rgba(0,214,143,0.4);
  animation: pulse-dot 2s ease-in-out infinite;
}
.glow-dot.red { background: #FF4D6A; box-shadow: 0 0 8px #FF4D6A, 0 0 16px rgba(255,77,106,0.4); }
.glow-dot.amber { background: #FFB547; box-shadow: 0 0 8px #FFB547, 0 0 16px rgba(255,181,71,0.4); }

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.8; }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes warningFlash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.card {
  background: #0F1628;
  border: 1px solid rgba(99,130,255,0.12);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.card:hover { border-color: rgba(99,130,255,0.25); }

.btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  letter-spacing: 0.02em;
}

.btn-primary {
  background: linear-gradient(135deg, #6382FF, #4A62D8);
  color: white;
  box-shadow: 0 4px 20px rgba(99,130,255,0.3);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,130,255,0.4); }
.btn-primary:active { transform: translateY(0); }

.btn-danger {
  background: linear-gradient(135deg, #FF4D6A, #CC3A55);
  color: white;
  box-shadow: 0 4px 16px rgba(255,77,106,0.25);
}
.btn-danger:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,77,106,0.35); }

.btn-ghost {
  background: transparent;
  color: #8892B0;
  border: 1px solid rgba(99,130,255,0.2);
}
.btn-ghost:hover { background: rgba(99,130,255,0.08); color: #E8ECFF; border-color: rgba(99,130,255,0.4); }

.btn-success {
  background: linear-gradient(135deg, #00D68F, #00A86B);
  color: white;
  box-shadow: 0 4px 16px rgba(0,214,143,0.25);
}
.btn-success:hover { transform: translateY(-1px); }

.input-field {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(99,130,255,0.2);
  border-radius: 10px;
  padding: 12px 16px;
  color: #E8ECFF;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
}
.input-field:focus { border-color: #6382FF; background: rgba(99,130,255,0.06); }
.input-field::placeholder { color: #4A5568; }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.badge-success { background: rgba(0,214,143,0.12); color: #00D68F; border: 1px solid rgba(0,214,143,0.2); }
.badge-danger { background: rgba(255,77,106,0.12); color: #FF4D6A; border: 1px solid rgba(255,77,106,0.2); }
.badge-warning { background: rgba(255,181,71,0.12); color: #FFB547; border: 1px solid rgba(255,181,71,0.2); }
.badge-info { background: rgba(99,130,255,0.12); color: #8FA4FF; border: 1px solid rgba(99,130,255,0.2); }
.badge-purple { background: rgba(167,139,250,0.12); color: #A78BFA; border: 1px solid rgba(167,139,250,0.2); }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #4A5568;
  font-weight: 500;
  white-space: nowrap;
}
.nav-item:hover { background: rgba(99,130,255,0.08); color: #8892B0; }
.nav-item.active { background: rgba(99,130,255,0.12); color: #8FA4FF; }

.metric-card {
  background: #0F1628;
  border: 1px solid rgba(99,130,255,0.1);
  border-radius: 14px;
  padding: 20px;
}

.progress-bar {
  height: 6px;
  background: rgba(99,130,255,0.1);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
  background: linear-gradient(90deg, #6382FF, #A78BFA);
}

.alert-item {
  padding: 12px 16px;
  border-radius: 10px;
  border-left: 3px solid;
  background: rgba(255,255,255,0.02);
  animation: slideIn 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.option-btn {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(99,130,255,0.15);
  color: #8892B0;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 14px;
}
.option-btn:hover { background: rgba(99,130,255,0.08); border-color: rgba(99,130,255,0.3); color: #E8ECFF; }
.option-btn.selected { background: rgba(99,130,255,0.12); border-color: #6382FF; color: #E8ECFF; }
.option-btn.correct { background: rgba(0,214,143,0.1); border-color: #00D68F; color: #00D68F; }
.option-btn.wrong { background: rgba(255,77,106,0.1); border-color: #FF4D6A; color: #FF4D6A; }

.warning-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(255,77,106,0.08);
  border: 3px solid #FF4D6A;
  pointer-events: none;
  animation: warningFlash 0.5s ease 4;
}

.camera-feed {
  width: 100%;
  aspect-ratio: 4/3;
  background: #060912;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(99,130,255,0.15);
}

.logo-text {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 22px;
  background: linear-gradient(135deg, #6382FF, #A78BFA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tab-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  background: transparent;
  border: none;
  color: #4A5568;
  font-family: 'DM Sans', sans-serif;
}
.tab-btn.active { background: rgba(99,130,255,0.12); color: #8FA4FF; }
.tab-btn:hover:not(.active) { color: #8892B0; }

.slide-in { animation: slideIn 0.3s ease forwards; }
.fade-in { animation: fadeIn 0.4s ease forwards; }
`;

function Icon({ name, size = 16, color = "currentColor" }) {
  const icons = {
    shield: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,
    user: <><circle cx="12" cy="8" r="4" fill="none" stroke={color} strokeWidth="1.5"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="7" r="4" fill="none" stroke={color} strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="1.5"/></>,
    check: <polyline points="20 6 9 17 4 12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    x: <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    clock: <><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="12 6 12 12 16 14" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    log: <><line x1="8" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" fill="none" stroke={color} strokeWidth="1.5"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" rx="1"/><rect x="14" y="3" width="7" height="7" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" rx="1"/><rect x="3" y="14" width="7" height="7" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" rx="1"/><rect x="14" y="14" width="7" height="7" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" rx="1"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 17 21 12 16 7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 10 12 15 17 10" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    trash: <><polyline points="3 6 5 6 21 6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,
    arrow_right: <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><polyline points="12 5 19 12 12 19" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    maximize: <><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    info: <><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5"/><line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="8" x2="12.01" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    bar_chart: <><line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    wifi_off: <><line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "inline-block", flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
}

function LogoBrand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{
        width: 36, height: 36,
        background: "linear-gradient(135deg, #6382FF, #A78BFA)",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon name="shield" size={18} color="white" />
      </div>
      <span className="logo-text">ExamSentinel</span>
    </div>
  );
}

function CaptchaWidget({ onVerify }) {
  const [input, setInput] = useState("");
  const [code] = useState(() => Math.random().toString(36).substring(2, 7).toUpperCase());
  const isValid = input.toUpperCase() === code;
  useEffect(() => { if (isValid) onVerify(true); else onVerify(false); }, [input]);
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(99,130,255,0.15), rgba(167,139,250,0.15))",
        border: "1px solid rgba(99,130,255,0.25)",
        borderRadius: 8, padding: "8px 16px",
        fontFamily: "monospace", fontSize: 18, fontWeight: 700,
        letterSpacing: "0.25em", color: "#8FA4FF",
        userSelect: "none",
        textDecoration: "line-through",
        textDecorationColor: "rgba(99,130,255,0.3)",
      }}>{code}</div>
      <input
        className="input-field"
        placeholder="Enter CAPTCHA"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ flex: 1 }}
      />
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("signin");
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [captchaOk, setCaptchaOk] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "student", label: "Student", icon: "user", color: "#6382FF" },
    { id: "admin", label: "Admin", icon: "shield", color: "#00D68F" },
    { id: "qmanager", label: "Question Manager", icon: "book", color: "#A78BFA" },
  ];

  const handleLogin = () => {
    if (!captchaOk) { setError("Please complete the CAPTCHA verification."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = INITIAL_DATA.users.find(u =>
        (u.username === form.username || u.email === form.username) &&
        u.password === form.password && u.role === role
      );
      if (user) {
        onLogin(user);
      } else {
        setError("Invalid credentials or role mismatch. Try: admin/admin123, qmanager/qm123, or student1/pass123");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0E1A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: 20,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(99,130,255,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(0,214,143,0.04) 0%, transparent 50%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(99,130,255,0.4), transparent)",
      }} />

      <div className="slide-in" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56,
              background: "linear-gradient(135deg, #6382FF, #A78BFA)",
              borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 32px rgba(99,130,255,0.3)",
            }}>
              <Icon name="shield" size={26} color="white" />
            </div>
          </div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: "#E8ECFF", marginBottom: 6 }}>ExamSentinel</h1>
          <p style={{ color: "#4A5568", fontSize: 14 }}>Intelligent Online Examination Platform</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4 }}>
            {["signin", "signup"].map(m => (
              <button key={m} className="tab-btn" style={{ flex: 1, padding: "8px" }}
                onClick={() => { setMode(m); setError(""); }}
                data-active={mode === m ? "" : undefined}
              >
                <span className={mode === m ? "tab-btn active" : "tab-btn"} style={{ padding: 0 }}>
                  {m === "signin" ? "Sign In" : "Create Account"}
                </span>
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: "#4A5568", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Select Role</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {roles.map(r => (
                <button key={r.id} onClick={() => setRole(r.id)} style={{
                  padding: "10px 8px",
                  borderRadius: 10,
                  border: `1px solid ${role === r.id ? r.color + "55" : "rgba(99,130,255,0.12)"}`,
                  background: role === r.id ? r.color + "15" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                }}>
                  <Icon name={r.icon} size={16} color={role === r.id ? r.color : "#4A5568"} />
                  <span style={{ fontSize: 11, color: role === r.id ? r.color : "#4A5568", fontWeight: 500 }}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input className="input-field" placeholder="Username or Email" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} />
            {mode === "signup" && (
              <input className="input-field" placeholder="Email Address" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} type="email" />
            )}
            <input className="input-field" placeholder="Password" value={form.password} type="password"
              onChange={e => setForm({ ...form, password: e.target.value })} />
            <CaptchaWidget onVerify={setCaptchaOk} />
          </div>

          {error && (
            <div style={{
              marginTop: 12, padding: "10px 14px",
              background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.2)",
              borderRadius: 8, fontSize: 13, color: "#FF4D6A",
            }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary" style={{ width: "100%", marginTop: 20, padding: "13px", fontSize: 15 }}
            onClick={handleLogin} disabled={loading}>
            {loading ? "Authenticating..." : mode === "signin" ? "Sign In Securely" : "Create Account"}
          </button>

          <div style={{
            marginTop: 16, padding: "10px 14px",
            background: "rgba(99,130,255,0.06)", borderRadius: 8,
            fontSize: 12, color: "#4A5568", lineHeight: 1.5,
          }}>
            <strong style={{ color: "#6382FF" }}>Demo Credentials:</strong><br />
            Admin: admin / admin123 &nbsp;|&nbsp; Student: student1 / pass123<br />
            QManager: qmanager / qm123
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#2D3748" }}>
          Protected by JWT authentication · TLS encrypted
        </p>
      </div>
    </div>
  );
}

function TopNav({ user, onLogout, alerts = [] }) {
  const roleColor = { admin: "#00D68F", student: "#6382FF", qmanager: "#A78BFA" };
  return (
    <div style={{
      height: 56, display: "flex", alignItems: "center",
      padding: "0 24px", borderBottom: "1px solid rgba(99,130,255,0.1)",
      background: "rgba(10,14,26,0.95)", backdropFilter: "blur(20px)",
      position: "sticky", top: 0, zIndex: 100,
      justifyContent: "space-between",
    }}>
      <LogoBrand />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {alerts.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 20,
            background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.2)",
          }}>
            <div className="glow-dot red" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 12, color: "#FF4D6A" }}>{alerts.length} Active Alert{alerts.length !== 1 ? "s" : ""}</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: roleColor[user.role] + "20",
            border: `1px solid ${roleColor[user.role]}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, color: roleColor[user.role],
          }}>
            {user.name?.charAt(0) || user.username.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: 13 }}>
            <div style={{ fontWeight: 500, color: "#E8ECFF" }}>{user.name || user.username}</div>
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "capitalize" }}>{user.role}</div>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 13 }} onClick={onLogout}>
          <Icon name="logout" size={14} /> &nbsp;Exit
        </button>
      </div>
    </div>
  );
}

function AdminDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [activeStudents, setActiveStudents] = useState(ACTIVE_STUDENTS);
  const [logs, setLogs] = useState(INITIAL_DATA.activityLogs);
  const [alerts, setAlerts] = useState([
    { id: 1, type: "warning", msg: "Maya Patel — 2 violations detected", time: "2 min ago", student: "Maya Patel" },
    { id: 2, type: "camera", msg: "Leo Chen — Camera disconnected", time: "5 min ago", student: "Leo Chen" },
  ]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
      if (Math.random() > 0.7) {
        const randomStudents = ["John Smith", "Maya Patel", "Leo Chen"];
        const actions = ["tab_switch_detected", "right_click_blocked", "fullscreen_restored", "camera_reconnected"];
        const s = randomStudents[Math.floor(Math.random() * 3)];
        const a = actions[Math.floor(Math.random() * 4)];
        const newLog = { id: Date.now(), studentName: s, action: a, exam: "Math Exam", timestamp: new Date() };
        setLogs(l => [newLog, ...l.slice(0, 19)]);
        if (a === "tab_switch_detected" || a === "fullscreen_restored") {
          const alert = { id: Date.now(), type: "warning", msg: `${s} — ${a.replace(/_/g, " ")}`, time: "just now", student: s };
          setAlerts(al => [alert, ...al.slice(0, 4)]);
        }
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: "grid" },
    { id: "students", label: "Live Students", icon: "users" },
    { id: "logs", label: "Activity Logs", icon: "log" },
    { id: "exams", label: "Exams", icon: "book" },
  ];

  const getElapsed = (start) => {
    const mins = Math.floor((Date.now() - new Date(start).getTime()) / 60000);
    return `${mins}m`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0E1A" }}>
      <TopNav user={user} onLogout={onLogout} alerts={alerts} />
      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <div style={{
          width: 200, borderRight: "1px solid rgba(99,130,255,0.1)",
          padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto",
        }}>
          {tabs.map(t => (
            <div key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={15} />
              <span>{t.label}</span>
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: "12px 0" }}>
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(0,214,143,0.06)", border: "1px solid rgba(0,214,143,0.15)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div className="glow-dot" />
                <span style={{ fontSize: 12, color: "#00D68F", fontWeight: 500 }}>System Live</span>
              </div>
              <div style={{ fontSize: 11, color: "#4A5568" }}>{activeStudents.length} students active</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {tab === "overview" && (
            <div className="fade-in">
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#E8ECFF" }}>
                Admin Dashboard
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Active Students", value: activeStudents.length, icon: "users", color: "#6382FF" },
                  { label: "Ongoing Exams", value: 2, icon: "book", color: "#A78BFA" },
                  { label: "Total Alerts", value: alerts.length, icon: "alert", color: "#FF4D6A" },
                  { label: "Completed Today", value: 7, icon: "check", color: "#00D68F" },
                ].map((m, i) => (
                  <div key={i} className="metric-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: m.color + "18",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name={m.icon} size={18} color={m.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: m.color, fontFamily: "Syne, sans-serif" }}>{m.value}</div>
                      <div style={{ fontSize: 12, color: "#4A5568" }}>{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E8ECFF" }}>Live Student Status</h3>
                    <span className="badge badge-success">
                      <div className="glow-dot" style={{ width: 6, height: 6 }} />
                      Real-time
                    </span>
                  </div>
                  {activeStudents.map(s => (
                    <div key={s.id} style={{
                      padding: "12px 0", borderBottom: "1px solid rgba(99,130,255,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className={`glow-dot ${s.warnings >= 2 ? "red" : s.warnings >= 1 ? "amber" : ""}`} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#E8ECFF" }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: "#4A5568" }}>{s.exam}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {s.warnings > 0 && (
                          <span className={`badge ${s.warnings >= 2 ? "badge-danger" : "badge-warning"}`} style={{ fontSize: 11 }}>
                            ⚠ {s.warnings}
                          </span>
                        )}
                        <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }}
                          onClick={() => { setSelectedStudent(s); setTab("students"); }}>
                          Monitor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E8ECFF" }}>Real-Time Alerts</h3>
                    <span style={{ fontSize: 11, color: "#4A5568" }}>Socket.IO connected</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {alerts.slice(0, 4).map(a => (
                      <div key={a.id} className="alert-item" style={{
                        borderLeftColor: a.type === "warning" ? "#FF4D6A" : "#FFB547",
                      }}>
                        <Icon name={a.type === "warning" ? "alert" : "camera"} size={14}
                          color={a.type === "warning" ? "#FF4D6A" : "#FFB547"} />
                        <div>
                          <div style={{ fontSize: 13, color: "#E8ECFF" }}>{a.msg}</div>
                          <div style={{ fontSize: 11, color: "#4A5568", marginTop: 2 }}>{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "students" && (
            <div className="fade-in">
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#E8ECFF" }}>
                Live Student Monitoring
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: selectedStudent ? "1fr 1fr" : "1fr", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {activeStudents.map(s => (
                    <div key={s.id} className="card" style={{
                      padding: 18, cursor: "pointer",
                      borderColor: selectedStudent?.id === s.id ? "rgba(99,130,255,0.5)" : undefined,
                    }} onClick={() => setSelectedStudent(s)}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: "50%",
                            background: s.warnings >= 2 ? "rgba(255,77,106,0.15)" : "rgba(99,130,255,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, fontWeight: 700, color: s.warnings >= 2 ? "#FF4D6A" : "#6382FF",
                          }}>{s.name.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#E8ECFF" }}>{s.name}</div>
                            <div style={{ fontSize: 12, color: "#4A5568" }}>{s.exam}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span className={`badge ${s.cameraOn ? "badge-success" : "badge-danger"}`}>
                            <Icon name="camera" size={11} /> {s.cameraOn ? "On" : "Off"}
                          </span>
                          {s.warnings > 0 && (
                            <span className={`badge ${s.warnings >= 2 ? "badge-danger" : "badge-warning"}`}>
                              {s.warnings}/3 warn
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ marginTop: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4A5568", marginBottom: 6 }}>
                          <span>Progress: {s.progress}/{s.total} questions</span>
                          <span>Time: {getElapsed(s.startTime)}</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${(s.progress / s.total) * 100}%` }} />
                        </div>
                      </div>
                      {s.warnings >= 2 && (
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button className="btn btn-danger" style={{ flex: 1, padding: "7px", fontSize: 12 }}
                            onClick={e => { e.stopPropagation(); alert(`${s.name}'s exam terminated!`); setActiveStudents(prev => prev.filter(st => st.id !== s.id)); }}>
                            Terminate Exam
                          </button>
                          <button className="btn btn-ghost" style={{ flex: 1, padding: "7px", fontSize: 12 }}
                            onClick={e => { e.stopPropagation(); setActiveStudents(prev => prev.map(st => st.id === s.id ? { ...st, warnings: 0 } : st)); }}>
                            Clear Warnings
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedStudent && (
                  <div className="card" style={{ padding: 20, position: "sticky", top: 20, alignSelf: "flex-start" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ fontWeight: 600, color: "#E8ECFF" }}>{selectedStudent.name}</h3>
                      <button onClick={() => setSelectedStudent(null)} style={{
                        background: "none", border: "none", cursor: "pointer", color: "#4A5568", padding: 4,
                      }}>
                        <Icon name="x" size={16} />
                      </button>
                    </div>

                    <div className="camera-feed" style={{ marginBottom: 16 }}>
                      {selectedStudent.cameraOn ? (
                        <div style={{
                          width: "100%", height: "100%",
                          background: "linear-gradient(135deg, #060912, #0F1628)",
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                        }}>
                          <div style={{
                            width: 64, height: 64, borderRadius: "50%",
                            background: "rgba(99,130,255,0.1)", border: "2px solid rgba(99,130,255,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Icon name="user" size={28} color="#6382FF" />
                          </div>
                          <div style={{ fontSize: 12, color: "#4A5568" }}>Live Feed — {selectedStudent.name}</div>
                          <div style={{
                            position: "absolute", top: 8, left: 8,
                            display: "flex", alignItems: "center", gap: 5,
                            background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: 4,
                          }}>
                            <div className="glow-dot" style={{ width: 6, height: 6 }} />
                            <span style={{ fontSize: 11, color: "#00D68F" }}>LIVE</span>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
                          background: "#060912",
                        }}>
                          <Icon name="wifi_off" size={32} color="#FF4D6A" />
                          <span style={{ fontSize: 13, color: "#FF4D6A" }}>Camera Disconnected</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                      {[
                        ["Exam", selectedStudent.exam],
                        ["Progress", `${selectedStudent.progress}/${selectedStudent.total} questions`],
                        ["Warnings", `${selectedStudent.warnings}/3`],
                        ["Duration", getElapsed(selectedStudent.startTime)],
                        ["Camera", selectedStudent.cameraOn ? "Active" : "Disconnected"],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(99,130,255,0.06)" }}>
                          <span style={{ color: "#4A5568" }}>{k}</span>
                          <span style={{ color: "#E8ECFF", fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                      <button className="btn btn-danger" style={{ flex: 1, fontSize: 12, padding: "8px" }}>
                        Remove Student
                      </button>
                      <button className="btn btn-success" style={{ flex: 1, fontSize: 12, padding: "8px" }}>
                        Allow Re-Entry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "logs" && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "#E8ECFF" }}>Activity Logs</h2>
                <button className="btn btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <Icon name="download" size={14} /> Export CSV
                </button>
              </div>
              <div className="card" style={{ overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(99,130,255,0.08)", display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="glow-dot" />
                  <span style={{ fontSize: 13, color: "#8892B0" }}>Live feed · Auto-updating every 3s</span>
                </div>
                {logs.map((log, i) => {
                  const colorMap = {
                    tab_switch: "#FF4D6A", tab_switch_detected: "#FF4D6A",
                    fullscreen_exit: "#FFB547", fullscreen_restored: "#00D68F",
                    exam_started: "#00D68F",
                    right_click_blocked: "#A78BFA", camera_reconnected: "#6382FF",
                  };
                  const c = colorMap[log.action] || "#8892B0";
                  return (
                    <div key={log.id} style={{
                      padding: "12px 20px",
                      borderBottom: "1px solid rgba(99,130,255,0.05)",
                      display: "flex", alignItems: "center", gap: 16,
                      animation: i === 0 ? "slideIn 0.3s ease" : "none",
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ color: "#E8ECFF", fontSize: 13, fontWeight: 500 }}>{log.studentName}</span>
                        <span style={{ color: "#4A5568", fontSize: 13 }}> · </span>
                        <span style={{ color: c, fontSize: 13 }}>{log.action?.replace(/_/g, " ")}</span>
                      </div>
                      <span style={{ color: "#4A5568", fontSize: 12 }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "exams" && (
            <div className="fade-in">
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#E8ECFF" }}>Exam Management</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {INITIAL_DATA.exams.map(exam => (
                  <div key={exam.id} className="card" style={{ padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: "rgba(99,130,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon name="book" size={20} color="#6382FF" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#E8ECFF", fontSize: 15 }}>{exam.title}</div>
                        <div style={{ fontSize: 12, color: "#4A5568" }}>{exam.duration} min · {exam.totalQ} questions</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className={`badge ${exam.status === "active" ? "badge-success" : "badge-warning"}`}>
                        {exam.status}
                      </span>
                      <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }}>View Results</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionManagerDashboard({ user, onLogout }) {
  const [questions, setQuestions] = useState(INITIAL_DATA.questions);
  const [exams] = useState(INITIAL_DATA.exams);
  const [selectedExam, setSelectedExam] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [form, setForm] = useState({
    text: "", options: ["", "", "", ""], correct: 0, exam_id: 1
  });

  const examQs = questions.filter(q => q.exam_id === selectedExam);

  const saveQuestion = () => {
    if (!form.text.trim()) return;
    if (editingQ) {
      setQuestions(prev => prev.map(q => q.id === editingQ.id ? { ...form, id: editingQ.id } : q));
    } else {
      setQuestions(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingQ(null);
    setForm({ text: "", options: ["", "", "", ""], correct: 0, exam_id: selectedExam });
  };

  const deleteQuestion = (id) => setQuestions(prev => prev.filter(q => q.id !== id));

  const editQuestion = (q) => {
    setForm({ text: q.text, options: [...q.options], correct: q.correct, exam_id: q.exam_id });
    setEditingQ(q);
    setShowForm(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0E1A" }}>
      <TopNav user={user} onLogout={onLogout} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "#E8ECFF" }}>Question Bank</h1>
            <p style={{ fontSize: 14, color: "#4A5568", marginTop: 4 }}>Manage exam questions and answer keys</p>
          </div>
          <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => { setShowForm(true); setEditingQ(null); setForm({ text: "", options: ["", "", "", ""], correct: 0, exam_id: selectedExam }); }}>
            <Icon name="plus" size={15} color="white" /> Add Question
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {exams.map(e => (
            <button key={e.id} className="tab-btn" style={{ padding: "8px 16px" }}
              onClick={() => setSelectedExam(e.id)}
              data-active={selectedExam === e.id}>
              <span className={selectedExam === e.id ? "tab-btn active" : "tab-btn"} style={{ padding: 0 }}>
                {e.title}
              </span>
            </button>
          ))}
        </div>

        {showForm && (
          <div className="card slide-in" style={{ padding: 24, marginBottom: 20, borderColor: "rgba(99,130,255,0.3)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: 18, color: "#E8ECFF" }}>
              {editingQ ? "Edit Question" : "New Question"}
            </h3>
            <textarea
              className="input-field"
              placeholder="Question text..."
              value={form.text}
              onChange={e => setForm({ ...form, text: e.target.value })}
              rows={3} style={{ resize: "vertical", marginBottom: 14 }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {form.options.map((opt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button onClick={() => setForm({ ...form, correct: i })} style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: `2px solid ${form.correct === i ? "#00D68F" : "rgba(99,130,255,0.2)"}`,
                    background: form.correct === i ? "rgba(0,214,143,0.15)" : "transparent",
                    cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {form.correct === i && <Icon name="check" size={14} color="#00D68F" />}
                  </button>
                  <input
                    className="input-field"
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt}
                    onChange={e => {
                      const opts = [...form.options];
                      opts[i] = e.target.value;
                      setForm({ ...form, options: opts });
                    }}
                  />
                  {form.correct === i && <span className="badge badge-success" style={{ whiteSpace: "nowrap" }}>Correct</span>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={saveQuestion}>Save Question</button>
              <button className="btn btn-ghost" onClick={() => { setShowForm(false); setEditingQ(null); }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {examQs.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: "center" }}>
              <Icon name="book" size={40} color="#2D3748" />
              <p style={{ marginTop: 12, color: "#4A5568" }}>No questions yet. Add your first question.</p>
            </div>
          )}
          {examQs.map((q, idx) => (
            <div key={q.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: "#4A5568", background: "rgba(99,130,255,0.08)", padding: "2px 8px", borderRadius: 6 }}>Q{idx + 1}</span>
                    <span style={{ fontSize: 14, color: "#E8ECFF", fontWeight: 500 }}>{q.text}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {q.options.map((opt, i) => (
                      <div key={i} style={{
                        padding: "6px 10px", borderRadius: 6, fontSize: 13,
                        background: i === q.correct ? "rgba(0,214,143,0.08)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${i === q.correct ? "rgba(0,214,143,0.2)" : "rgba(99,130,255,0.08)"}`,
                        color: i === q.correct ? "#00D68F" : "#8892B0",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <span style={{ fontWeight: 600 }}>{String.fromCharCode(65 + i)}.</span> {opt}
                        {i === q.correct && <Icon name="check" size={12} color="#00D68F" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button className="btn btn-ghost" style={{ padding: "6px 10px" }} onClick={() => editQuestion(q)}>
                    <Icon name="edit" size={14} />
                  </button>
                  <button style={{
                    padding: "6px 10px", borderRadius: 8,
                    background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.2)",
                    cursor: "pointer", color: "#FF4D6A",
                  }} onClick={() => deleteQuestion(q.id)}>
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentExamList({ onStartExam }) {
  const exams = INITIAL_DATA.exams.filter(e => e.status === "active");
  return (
    <div>
      <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: "#E8ECFF" }}>Available Exams</h2>
      <p style={{ color: "#4A5568", marginBottom: 24, fontSize: 14 }}>Select an exam to begin. Ensure your camera is ready.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {exams.map(exam => (
          <div key={exam.id} className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(99,130,255,0.2), rgba(167,139,250,0.2))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="book" size={24} color="#8FA4FF" />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: "#E8ECFF", marginBottom: 4 }}>{exam.title}</h3>
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#4A5568" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="clock" size={13} /> {exam.duration} minutes
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="book" size={13} /> {exam.totalQ} questions
                    </span>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}
                onClick={() => onStartExam(exam)}>
                Start Exam <Icon name="arrow_right" size={15} color="white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamInterface({ exam, user, onComplete }) {
  const questions = INITIAL_DATA.questions.filter(q => q.exam_id === exam.id);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [warnings, setWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [terminated, setTerminated] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [phase, setPhase] = useState("instructions");

  useEffect(() => {
    if (phase !== "exam") return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const triggerWarning = useCallback((msg) => {
    setWarnings(w => {
      const nw = w + 1;
      if (nw >= 3) {
        setTerminated(true);
      } else {
        setWarningMsg(`⚠ Warning ${nw}/3: ${msg}`);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 4000);
      }
      return nw;
    });
  }, []);

  useEffect(() => {
    if (phase !== "exam") return;
    const handleVisibility = () => {
      if (document.hidden) triggerWarning("Tab switching detected");
    };
    const handleContextMenu = (e) => { e.preventDefault(); triggerWarning("Right-click disabled"); };
    const handleCopy = (e) => { e.preventDefault(); triggerWarning("Copy/paste disabled"); };
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handleCopy);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handleCopy);
    };
  }, [phase, triggerWarning]);

  const handleAnswer = (optIdx) => {
    setSelected(optIdx);
    setAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(answers[currentQ + 1] ?? null);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const score = questions.filter((q, i) => answers[i] === q.correct).length;
    onComplete({ score, total: questions.length, exam });
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (terminated) return (
    <div style={{
      minHeight: "100vh", background: "#0A0E1A",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div className="card slide-in" style={{ padding: 40, maxWidth: 440, textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(255,77,106,0.1)", border: "2px solid #FF4D6A",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <Icon name="x" size={32} color="#FF4D6A" />
        </div>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "#FF4D6A", marginBottom: 10 }}>
          Exam Terminated
        </h2>
        <p style={{ color: "#8892B0", fontSize: 14, lineHeight: 1.7 }}>
          Your exam has been terminated due to exceeding the maximum allowed violations (3/3).
          Please contact your administrator for re-entry authorization.
        </p>
        <div style={{
          marginTop: 20, padding: "14px 16px",
          background: "rgba(255,77,106,0.06)", borderRadius: 10,
          border: "1px solid rgba(255,77,106,0.15)", fontSize: 13, color: "#8892B0",
        }}>
          Admin has been notified of this termination.
        </div>
      </div>
    </div>
  );

  if (phase === "instructions") return (
    <div style={{
      minHeight: "100vh", background: "#0A0E1A",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div className="card slide-in" style={{ padding: 36, maxWidth: 520, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: "linear-gradient(135deg, rgba(99,130,255,0.2), rgba(167,139,250,0.2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <Icon name="info" size={28} color="#8FA4FF" />
          </div>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "#E8ECFF" }}>Exam Instructions</h2>
          <p style={{ color: "#4A5568", fontSize: 14, marginTop: 6 }}>{exam.title}</p>
        </div>

        {[
          ["Camera Required", "Your webcam must remain active throughout. Any disconnection counts as a violation.", "camera", "#FF4D6A"],
          ["Full Screen Mode", "The exam runs in full screen. Exiting triggers a warning.", "maximize", "#FFB547"],
          ["No Tab Switching", "Switching or minimizing tabs will be detected and logged immediately.", "eye", "#6382FF"],
          ["3 Warning Limit", "Exceeding 3 violations will auto-terminate your exam session.", "alert", "#A78BFA"],
          ["Auto-Save", "Your answers are saved continuously. Progress is never lost.", "check", "#00D68F"],
        ].map(([title, desc, icon, color]) => (
          <div key={title} style={{
            display: "flex", gap: 14, padding: "12px 0",
            borderBottom: "1px solid rgba(99,130,255,0.06)",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: color + "15",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={icon} size={16} color={color} />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 13, color: "#E8ECFF", marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 24 }}>
          <div style={{
            padding: "14px 16px", borderRadius: 10, marginBottom: 16,
            background: cameraOn ? "rgba(0,214,143,0.08)" : "rgba(255,77,106,0.06)",
            border: `1px solid ${cameraOn ? "rgba(0,214,143,0.2)" : "rgba(255,77,106,0.15)"}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="camera" size={16} color={cameraOn ? "#00D68F" : "#FF4D6A"} />
              <span style={{ fontSize: 13, color: cameraOn ? "#00D68F" : "#FF4D6A" }}>
                {cameraOn ? "Camera Active & Ready" : "Camera Permission Required"}
              </span>
            </div>
            <button className={`btn ${cameraOn ? "btn-ghost" : "btn-primary"}`} style={{ padding: "6px 14px", fontSize: 12 }}
              onClick={() => setCameraOn(c => !c)}>
              {cameraOn ? "Enabled ✓" : "Enable Camera"}
            </button>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%", padding: "13px", fontSize: 15 }}
            onClick={() => setPhase("exam")}
            disabled={!cameraOn}
          >
            {cameraOn ? `Begin Exam — ${questions.length} Questions` : "Enable Camera to Continue"}
          </button>
        </div>
      </div>
    </div>
  );

  const q = questions[currentQ];
  const warningColor = warnings === 0 ? "#00D68F" : warnings === 1 ? "#FFB547" : "#FF4D6A";

  return (
    <div style={{ minHeight: "100vh", background: "#0A0E1A", position: "relative" }}>
      {showWarning && (
        <>
          <div className="warning-overlay" />
          <div style={{
            position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,77,106,0.15)", border: "1px solid #FF4D6A",
            borderRadius: 12, padding: "12px 24px", zIndex: 1001,
            color: "#FF4D6A", fontWeight: 600, fontSize: 15,
            animation: "slideIn 0.3s ease",
          }}>
            {warningMsg}
          </div>
        </>
      )}

      <div style={{
        height: 56, display: "flex", alignItems: "center", padding: "0 24px",
        borderBottom: "1px solid rgba(99,130,255,0.1)", justifyContent: "space-between",
        background: "rgba(10,14,26,0.95)", position: "sticky", top: 0, zIndex: 50,
      }}>
        <LogoBrand />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8892B0" }}>
            <Icon name="book" size={14} /> {exam.title}
          </div>
          <div style={{
            padding: "6px 14px", borderRadius: 8,
            background: timeLeft < 300 ? "rgba(255,77,106,0.1)" : "rgba(99,130,255,0.08)",
            border: `1px solid ${timeLeft < 300 ? "rgba(255,77,106,0.3)" : "rgba(99,130,255,0.2)"}`,
            fontFamily: "monospace", fontSize: 16, fontWeight: 700,
            color: timeLeft < 300 ? "#FF4D6A" : "#8FA4FF",
          }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{
            padding: "5px 12px", borderRadius: 8,
            background: warnings === 0 ? "rgba(0,214,143,0.08)" : warnings === 1 ? "rgba(255,181,71,0.08)" : "rgba(255,77,106,0.08)",
            border: `1px solid ${warningColor}30`,
            fontSize: 13, color: warningColor, fontWeight: 500,
          }}>
            ⚠ {warnings}/3 warnings
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#4A5568" }}>
            <div className="glow-dot" style={{ width: 6, height: 6 }} />
            Monitored
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 740, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#4A5568" }}>Question {currentQ + 1} of {questions.length}</span>
          <span style={{ fontSize: 13, color: "#4A5568" }}>
            {Object.keys(answers).length} answered
          </span>
        </div>

        <div className="progress-bar" style={{ marginBottom: 32 }}>
          <div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="card slide-in" style={{ padding: 32 }}>
          <div style={{ marginBottom: 28 }}>
            <span className="badge badge-info" style={{ marginBottom: 14 }}>Multiple Choice</span>
            <h2 style={{ fontSize: 20, fontWeight: 500, color: "#E8ECFF", lineHeight: 1.5 }}>{q.text}</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => (
              <button key={i} className={`option-btn ${selected === i ? "selected" : ""}`}
                onClick={() => handleAnswer(i)}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${selected === i ? "#6382FF" : "rgba(99,130,255,0.2)"}`,
                  background: selected === i ? "rgba(99,130,255,0.15)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 600,
                  color: selected === i ? "#8FA4FF" : "#4A5568",
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: "50%", border: "1px solid",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 500, cursor: "pointer",
                  borderColor: i === currentQ ? "#6382FF" : answers[i] !== undefined ? "rgba(0,214,143,0.3)" : "rgba(99,130,255,0.15)",
                  background: i === currentQ ? "rgba(99,130,255,0.15)" : answers[i] !== undefined ? "rgba(0,214,143,0.08)" : "transparent",
                  color: i === currentQ ? "#8FA4FF" : answers[i] !== undefined ? "#00D68F" : "#4A5568",
                }} onClick={() => { setCurrentQ(i); setSelected(answers[i] ?? null); }}>
                  {i + 1}
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleNext} disabled={selected === null}>
              {currentQ === questions.length - 1 ? "Submit Exam" : "Next Question"}
              <Icon name="arrow_right" size={14} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ result, user, onBack }) {
  const pct = Math.round((result.score / result.total) * 100);
  const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : "F";
  const passed = pct >= 60;
  const [emailSent, setEmailSent] = useState(false);
  useEffect(() => { setTimeout(() => setEmailSent(true), 1500); }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#0A0E1A",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div className="card slide-in" style={{ padding: 44, maxWidth: 500, width: "100%", textAlign: "center" }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%", margin: "0 auto 20px",
          background: passed ? "rgba(0,214,143,0.1)" : "rgba(255,77,106,0.1)",
          border: `3px solid ${passed ? "#00D68F" : "#FF4D6A"}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: passed ? "#00D68F" : "#FF4D6A" }}>
            {grade}
          </div>
        </div>

        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "#E8ECFF", marginBottom: 6 }}>
          Exam Completed
        </h2>
        <p style={{ color: "#4A5568", marginBottom: 24, fontSize: 14 }}>{result.exam.title}</p>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28,
        }}>
          {[
            ["Score", `${result.score}/${result.total}`, "#6382FF"],
            ["Percentage", `${pct}%`, passed ? "#00D68F" : "#FF4D6A"],
            ["Status", passed ? "Passed" : "Failed", passed ? "#00D68F" : "#FF4D6A"],
          ].map(([label, value, color]) => (
            <div key={label} style={{
              padding: "14px 10px", borderRadius: 12,
              background: color + "10", border: `1px solid ${color}25`,
            }}>
              <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 11, color: "#4A5568", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: "14px 16px", borderRadius: 10, marginBottom: 20, textAlign: "left",
          background: emailSent ? "rgba(0,214,143,0.06)" : "rgba(99,130,255,0.06)",
          border: `1px solid ${emailSent ? "rgba(0,214,143,0.2)" : "rgba(99,130,255,0.15)"}`,
          fontSize: 13,
        }}>
          {emailSent ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#00D68F" }}>
              <Icon name="check" size={14} color="#00D68F" />
              Result email sent to {user.email}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#8892B0" }}>
              <Icon name="clock" size={14} />
              Sending result email...
            </div>
          )}
        </div>

        <button className="btn btn-primary" style={{ width: "100%", padding: "13px" }} onClick={onBack}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

function StudentDashboard({ user, onLogout }) {
  const [view, setView] = useState("list");
  const [currentExam, setCurrentExam] = useState(null);
  const [examResult, setExamResult] = useState(null);

  if (view === "exam" && currentExam) {
    return <ExamInterface exam={currentExam} user={user}
      onComplete={(result) => { setExamResult(result); setView("result"); }} />;
  }

  if (view === "result" && examResult) {
    return <ResultScreen result={examResult} user={user} onBack={() => setView("list")} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0E1A" }}>
      <TopNav user={user} onLogout={onLogout} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 32 }}>
        <div className="card slide-in" style={{ padding: 24, marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "rgba(99,130,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color: "#8FA4FF",
          }}>
            {user.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#E8ECFF", fontSize: 17 }}>Welcome, {user.name}</div>
            <div style={{ fontSize: 13, color: "#4A5568" }}>Student · {user.email}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <span className="badge badge-info">Student</span>
            <span className="badge badge-success">
              <div className="glow-dot" style={{ width: 6, height: 6 }} />
              Online
            </span>
          </div>
        </div>
        <StudentExamList onStartExam={(exam) => { setCurrentExam(exam); setView("exam"); }} />
      </div>
    </div>
  );
}

export default function ExamSentinel() {
  const [user, setUser] = useState(null);

  if (!user) return <LoginPage onLogin={setUser} />;

  if (user.role === "admin") return <AdminDashboard user={user} onLogout={() => setUser(null)} />;
  if (user.role === "qmanager") return <QuestionManagerDashboard user={user} onLogout={() => setUser(null)} />;
  return <StudentDashboard user={user} onLogout={() => setUser(null)} />;
}
