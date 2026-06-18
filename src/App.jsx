import { useState, useEffect } from "react";

function getMockWeatherData() {
  return {
    city: "Jakarta",
    temp_now: 31,
    temp_3h_ago: 24,
    humidity: 88,
    pressure_change: -4,
    condition: "Hujan Lebat",
    fetched_at: new Date().toLocaleTimeString("id-ID"),
  };
}

function analyzeRisk(data) {
  const tempSwing = Math.abs(data.temp_now - data.temp_3h_ago);
  const reasons = [];
  if (tempSwing >= 6) reasons.push(`Suhu turun ${tempSwing}°C dalam 3 jam`);
  if (data.humidity >= 90) reasons.push(`Kelembaban ${data.humidity}%`);
  if (data.pressure_change <= -5) reasons.push(`Tekanan udara turun`);
  if (reasons.length >= 2) return { level: "high", reasons };
  if (reasons.length === 1) return { level: "medium", reasons };
  return { level: "low", reasons: [] };
}

const LEVELS = {
  high: {
    label: "Pancaroba Alert",
    emoji: "🌧️",
    message: "Minum Tolak Angin sekarang.",
    sub: "Kondisi cuaca hari ini rawan bikin badan drop.",
    bg: "#FFF0F0",
    cardBg: "#FFE4E4",
    accent: "#E05C5C",
    tagBg: "#FECACA",
    tagText: "#991B1B",
  },
  medium: {
    label: "Waspada Cuaca",
    emoji: "⛅",
    message: "Bawa jaket ya.",
    sub: "Ada satu faktor cuaca yang perlu diperhatiin.",
    bg: "#FFFBEB",
    cardBg: "#FEF3C7",
    accent: "#D97706",
    tagBg: "#FDE68A",
    tagText: "#92400E",
  },
  low: {
    label: "Aman, Santai",
    emoji: "☀️",
    message: "Cuaca oke hari ini.",
    sub: "Gak ada yang aneh. Tetap minum air putih!",
    bg: "#F0FDF4",
    cardBg: "#DCFCE7",
    accent: "#16A34A",
    tagBg: "#BBF7D0",
    tagText: "#14532D",
  },
};

export default function App() {
  const [weather, setWeather] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  function loadData() {
    setLoading(true);
    setTimeout(() => {
      const data = getMockWeatherData();
      setWeather(data);
      setRisk(analyzeRisk(data));
      setLoading(false);
    }, 800);
  }

  useEffect(() => { loadData(); }, []);

  if (loading || !risk) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFF8F2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <div style={{ fontSize: "2.5rem" }}>🌤️</div>
        <p style={{ fontFamily: "inherit", color: "#A0845C", fontSize: "0.9rem" }}>Ngecek cuaca dulu...</p>
      </div>
    );
  }

  const level = LEVELS[risk.level];

  return (
    <div style={{ minHeight: "100vh", background: level.bg, fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", transition: "background 0.6s ease", padding: "0 0 3rem" }}>

      {/* Top bar */}
      <div style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "1rem", color: level.accent }}>WellCast</span>
        <span style={{ fontSize: "0.75rem", color: "#A09080" }}>Update: {weather.fetched_at}</span>
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* City */}
        <div style={{ textAlign: "center", paddingTop: "0.5rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#A09080", marginBottom: "4px", letterSpacing: "0.05em" }}>📍 {weather.city}</p>
          <p style={{ fontSize: "0.85rem", color: "#C0A090", background: "#FFF", borderRadius: 999, display: "inline-block", padding: "4px 14px", border: "1px solid #F0E0D0" }}>{weather.condition}</p>
        </div>

        {/* Main card */}
        <div style={{ background: level.cardBg, borderRadius: 28, padding: "2rem 1.5rem", textAlign: "center", border: `1.5px solid ${level.accent}22` }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>{level.emoji}</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3D2B1F", marginBottom: "0.5rem" }}>{level.label}</h1>
          <p style={{ fontSize: "1.05rem", fontWeight: 600, color: level.accent, marginBottom: "0.4rem" }}>{level.message}</p>
          <p style={{ fontSize: "0.875rem", color: "#7A6055", lineHeight: 1.6 }}>{level.sub}</p>

          {risk.reasons.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "1.25rem" }}>
              {risk.reasons.map((r, i) => (
                <span key={i} style={{ background: level.tagBg, color: level.tagText, fontSize: "0.78rem", fontWeight: 600, borderRadius: 999, padding: "5px 14px" }}>{r}</span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[
            { label: "Sekarang", value: `${weather.temp_now}°C`, icon: "🌡️" },
            { label: "3 Jam Lalu", value: `${weather.temp_3h_ago}°C`, icon: "⏱️" },
            { label: "Kelembaban", value: `${weather.humidity}%`, icon: "💧" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#FFFFFF", borderRadius: 20, padding: "1rem 0.5rem", textAlign: "center", border: "1px solid #F0E0D0" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{s.icon}</div>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "#3D2B1F" }}>{s.value}</p>
              <p style={{ fontSize: "0.7rem", color: "#A09080", marginTop: "2px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={loadData}
          style={{ background: "#FFFFFF", border: `1.5px solid ${level.accent}55`, borderRadius: 999, padding: "0.75rem 2rem", color: level.accent, fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", alignSelf: "center", marginTop: "0.5rem" }}
        >
          Refresh ↺
        </button>

        <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#C0A890" }}>⚙️ Mock data — real API coming soon</p>
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { Thermometer, Droplets, Wind, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

// // ── MOCK DATA (swap this function with a real API call later) ──────────────
// function getMockWeatherData() {
//   return {
//     city: "Jakarta",
//     temp_now: 31,
//     temp_3h_ago: 24,       // simulates a 7°C drop → triggers alert
//     humidity: 88,
//     pressure_change: -4,   // hPa drop
//     condition: "Hujan Lebat",
//     fetched_at: new Date().toLocaleTimeString("id-ID"),
//   };
// }

// // ── RISK LOGIC ────────────────────────────────────────────────────────────
// function analyzeRisk(data) {
//   const tempSwing = Math.abs(data.temp_now - data.temp_3h_ago);
//   const reasons = [];

//   if (tempSwing >= 6) reasons.push(`Suhu turun ${tempSwing}°C dalam 3 jam`);
//   if (data.humidity >= 90) reasons.push(`Kelembaban ${data.humidity}% (sangat tinggi)`);
//   if (data.pressure_change <= -5) reasons.push(`Tekanan udara turun tajam`);

//   if (reasons.length >= 2) return { level: "high", reasons };
//   if (reasons.length === 1) return { level: "medium", reasons };
//   return { level: "low", reasons: [] };
// }

// const LEVELS = {
//   high: {
//     label: "Pancaroba Alert 🍃",
//     message: "Minum Tolak Angin sekarang. Serius.",
//     sub: "Kondisi cuaca hari ini bikin badan gampang drop.",
//     bg: "linear-gradient(135deg, #1a0a0a 0%, #2d0f0f 100%)",
//     accent: "#ff4d4d",
//     icon: <AlertTriangle size={40} />,
//   },
//   medium: {
//     label: "Waspada Cuaca ⚠️",
//     message: "Jaga kondisi, bawa jaket.",
//     sub: "Ada satu faktor cuaca yang perlu diperhatiin.",
//     bg: "linear-gradient(135deg, #1a1400 0%, #2d2200 100%)",
//     accent: "#ffb800",
//     icon: <Wind size={40} />,
//   },
//   low: {
//     label: "Aman, Santai 😎",
//     message: "Cuaca standar hari ini.",
//     sub: "Gak ada yang aneh. Tetap minum air putih yang banyak.",
//     bg: "linear-gradient(135deg, #001a0d 0%, #002d18 100%)",
//     accent: "#00e676",
//     icon: <CheckCircle size={40} />,
//   },
// };

// // ── MAIN APP ──────────────────────────────────────────────────────────────
// export default function App() {
//   const [weather, setWeather] = useState(null);
//   const [risk, setRisk] = useState(null);
//   const [loading, setLoading] = useState(true);

//   function loadData() {
//     setLoading(true);
//     // Simulate async fetch (replace this setTimeout + getMockWeatherData
//     // with your real API call — e.g. Open-Meteo or BMKG)
//     setTimeout(() => {
//       const data = getMockWeatherData();
//       setWeather(data);
//       setRisk(analyzeRisk(data));
//       setLoading(false);
//     }, 800);
//   }

//   useEffect(() => { loadData(); }, []);

//   if (loading || !risk) return <LoadingScreen />;

//   const level = LEVELS[risk.level];

//   return (
//     <div style={{ minHeight: "100vh", background: level.bg, transition: "background 0.8s ease" }}>
//       <div style={styles.container}>

//         {/* Header */}
//         <div style={styles.header}>
//           <p style={{ ...styles.eyebrow, color: level.accent }}>Gak Enak Badan Indicator</p>
//           <h1 style={styles.city}>{weather.city}</h1>
//           <p style={styles.time}>Update: {weather.fetched_at}</p>
//         </div>

//         {/* Main Status Card */}
//         <div style={{ ...styles.card, borderColor: level.accent + "44" }}>
//           <div style={{ color: level.accent }}>{level.icon}</div>
//           <h2 style={{ ...styles.statusLabel, color: level.accent }}>{level.label}</h2>
//           <p style={styles.message}>{level.message}</p>
//           <p style={styles.sub}>{level.sub}</p>

//           {risk.reasons.length > 0 && (
//             <div style={styles.reasonBox}>
//               {risk.reasons.map((r, i) => (
//                 <div key={i} style={{ ...styles.reasonChip, borderColor: level.accent + "55", color: level.accent }}>
//                   {r}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Stats Row */}
//         <div style={styles.statsRow}>
//           <Stat icon={<Thermometer size={18} />} label="Suhu Sekarang" value={`${weather.temp_now}°C`} accent={level.accent} />
//           <Stat icon={<Thermometer size={18} />} label="3 Jam Lalu" value={`${weather.temp_3h_ago}°C`} accent={level.accent} />
//           <Stat icon={<Droplets size={18} />} label="Kelembaban" value={`${weather.humidity}%`} accent={level.accent} />
//         </div>

//         {/* Condition badge */}
//         <div style={styles.conditionBadge}>
//           <Wind size={14} style={{ opacity: 0.6 }} />
//           <span style={{ opacity: 0.7, fontSize: "0.85rem" }}>{weather.condition}</span>
//         </div>

//         {/* Refresh */}
//         <button style={{ ...styles.refreshBtn, color: level.accent, borderColor: level.accent + "44" }} onClick={loadData}>
//           <RefreshCw size={14} /> Refresh Data
//         </button>

//         {/* Mock data disclaimer */}
//         <p style={styles.disclaimer}>⚙️ Currently using mock data — real BMKG/Open-Meteo API coming soon</p>
//       </div>
//     </div>
//   );
// }

// function Stat({ icon, label, value, accent }) {
//   return (
//     <div style={styles.statCard}>
//       <div style={{ color: accent, opacity: 0.8 }}>{icon}</div>
//       <p style={styles.statValue}>{value}</p>
//       <p style={styles.statLabel}>{label}</p>
//     </div>
//   );
// }

// function LoadingScreen() {
//   return (
//     <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", background: "#0f1117" }}>
//       <RefreshCw size={32} color="#555" style={{ animation: "spin 1s linear infinite" }} />
//       <p style={{ color: "#555", fontSize: "0.9rem" }}>Ngecek cuaca dulu...</p>
//       <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// }

// // ── STYLES ────────────────────────────────────────────────────────────────
// const styles = {
//   container: { maxWidth: 480, margin: "0 auto", padding: "2.5rem 1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" },
//   header: { textAlign: "center", paddingBottom: "0.5rem" },
//   eyebrow: { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" },
//   city: { fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em" },
//   time: { fontSize: "0.8rem", opacity: 0.4, marginTop: "0.25rem" },
//   card: { background: "rgba(255,255,255,0.04)", border: "1px solid", borderRadius: 20, padding: "2rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", textAlign: "center", backdropFilter: "blur(12px)" },
//   statusLabel: { fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.01em" },
//   message: { fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.4 },
//   sub: { fontSize: "0.88rem", opacity: 0.55, lineHeight: 1.5 },
//   reasonBox: { display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "0.25rem" },
//   reasonChip: { fontSize: "0.78rem", border: "1px solid", borderRadius: 999, padding: "0.3rem 0.75rem", fontWeight: 600 },
//   statsRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" },
//   statCard: { background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "1rem 0.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", border: "1px solid rgba(255,255,255,0.06)" },
//   statValue: { fontSize: "1.2rem", fontWeight: 800 },
//   statLabel: { fontSize: "0.7rem", opacity: 0.45, textAlign: "center", lineHeight: 1.3 },
//   conditionBadge: { display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "center" },
//   refreshBtn: { display: "flex", alignItems: "center", gap: "0.5rem", background: "transparent", border: "1px solid", borderRadius: 999, padding: "0.6rem 1.25rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, alignSelf: "center", transition: "opacity 0.2s" },
//   disclaimer: { textAlign: "center", fontSize: "0.72rem", opacity: 0.3, lineHeight: 1.5 },
// };