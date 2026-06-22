import { useState } from "react";

const API_BASE = "/api/download";

/* ── Icons ── */
const IcDownload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcMusic = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);
const IcVideo = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>
);
const IcSpin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:"spin .7s linear infinite",display:"block"}}>
    <path d="M12 2a10 10 0 0 1 10 10" opacity=".3"/><path d="M22 12A10 10 0 0 1 2 12"/>
  </svg>
);
const IcX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcHD = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 12h3m0 0V9m0 3v3m5-6v6m0-3h-3"/>
  </svg>
);
const IcStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

/* ── TikShak Logo ── */
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff2d55"/>
        <stop offset="100%" stopColor="#ff6b00"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="9" fill="url(#lg1)"/>
    <path d="M22 9a5.5 5.5 0 0 1-4.5-4.5V3h-3.5v13.5a3 3 0 1 1-3-3c.3 0 .6 0 .9.1V10a6.5 6.5 0 1 0 6.1 6.5V10.8A9.2 9.2 0 0 0 23 12V9a5.5 5.5 0 0 1-1 0z" fill="white"/>
  </svg>
);

export default function TikShak() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState({});

  const isValidUrl = (u) => /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/.test(u);

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Pega un enlace de TikTok primero."); return; }
    if (!isValidUrl(trimmed)) { setError("Ese enlace no parece ser de TikTok."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API_BASE}?url=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      if (!data || data.error) throw new Error(data?.error || "No se pudo obtener el video.");
      setResult(data);
    } catch (e) {
      setError(e.message || "Error inesperado. Intenta con otro enlace.");
    } finally { setLoading(false); }
  };

  const handlePaste = async () => {
    try { const t = await navigator.clipboard.readText(); setUrl(t); setError(""); }
    catch { setError("No se pudo acceder al portapapeles."); }
  };

  const downloadFile = async (fileUrl, filename) => {
    setDownloading(p => ({ ...p, [fileUrl]: true }));
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } catch { window.open(fileUrl, "_blank"); }
    finally { setDownloading(p => ({ ...p, [fileUrl]: false })); }
  };

  const fmt = (n) => {
    if (!n) return "0";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return String(n);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", fontFamily: "'Space Grotesk', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes shimmer { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-ring { 0%{transform:scale(.95);box-shadow:0 0 0 0 rgba(255,45,85,.4)} 70%{transform:scale(1);box-shadow:0 0 0 12px rgba(255,45,85,0)} 100%{transform:scale(.95)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #ff2d55; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ff2d5540; border-radius: 2px; }

        .orb { position:fixed; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:0; }

        .glass {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .input-wrap {
          background: rgba(255,255,255,.05);
          border: 1.5px solid rgba(255,255,255,.1);
          border-radius: 18px;
          transition: border-color .2s, box-shadow .2s;
        }
        .input-wrap:focus-within {
          border-color: #ff2d55;
          box-shadow: 0 0 0 4px rgba(255,45,85,.12), 0 0 40px rgba(255,45,85,.08);
        }

        .btn-main {
          background: linear-gradient(135deg, #ff2d55 0%, #ff6b00 100%);
          border: none; border-radius: 14px; color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 15px; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: transform .15s, box-shadow .2s, opacity .2s;
          padding: 13px 22px;
          white-space: nowrap;
        }
        .btn-main:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,45,85,.45); }
        .btn-main:active:not(:disabled) { transform: translateY(0); }
        .btn-main:disabled { opacity: .6; cursor: not-allowed; }

        .btn-paste {
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px; color: #aaa;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 500;
          padding: 8px 14px; cursor: pointer;
          transition: background .15s, color .15s;
        }
        .btn-paste:hover { background: rgba(255,255,255,.12); color: #fff; }

        .btn-clear { background:none; border:none; color:#555; cursor:pointer; padding:6px; transition:color .15s; display:flex; }
        .btn-clear:hover { color:#fff; }

        .result-card {
          animation: fadeUp .4s ease both;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px; overflow: hidden;
        }

        .dl-chip {
          display: inline-flex; align-items: center; gap: 8px;
          border-radius: 12px; padding: 11px 18px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; border: none;
          transition: transform .15s, box-shadow .2s, opacity .2s;
        }
        .dl-chip:disabled { opacity: .55; cursor: not-allowed; }
        .dl-chip.primary {
          background: linear-gradient(135deg,#ff2d55,#ff6b00);
          color: #fff;
        }
        .dl-chip.primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,45,85,.4); }
        .dl-chip.secondary {
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          color: #ccc;
        }
        .dl-chip.secondary:hover:not(:disabled) { background: rgba(255,255,255,.12); color:#fff; transform:translateY(-1px); }

        .stat-tag {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 999px; padding: 4px 12px;
          font-size: 12px; color: #888;
          display: inline-flex; align-items: center; gap: 5px;
        }

        .feature-card {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px; padding: 22px;
          transition: border-color .2s, background .2s;
        }
        .feature-card:hover { border-color: rgba(255,45,85,.3); background: rgba(255,45,85,.04); }

        .step-num {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg,#ff2d55,#ff6b00);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }

        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,45,85,.12); border: 1px solid rgba(255,45,85,.25);
          border-radius: 999px; padding: 5px 13px;
          font-size: 12px; font-weight: 600; color: #ff6b6b;
          letter-spacing: .3px;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #ff2d55 40%, #ff9500 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        @media (max-width: 600px) {
          .hero-title { font-size: 36px !important; }
          .input-row { flex-wrap: wrap; }
          .btn-main span { display: none; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Ambient orbs */}
      <div className="orb" style={{ width:500, height:500, background:"#ff2d5520", top:-150, right:-100 }}/>
      <div className="orb" style={{ width:400, height:400, background:"#ff6b0015", bottom:0, left:-100 }}/>
      <div className="orb" style={{ width:300, height:300, background:"#7c3aed10", top:"40%", left:"50%" }}/>

      {/* ── Header ── */}
      <header style={{ position:"relative", zIndex:10, borderBottom:"1px solid rgba(255,255,255,.06)", padding:"0 24px" }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Logo/>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, letterSpacing:"-0.5px" }}>
              Tik<span style={{ color:"#ff2d55" }}>Shak</span>
            </span>
          </div>
          <div className="badge">
            <IcStar/> 100% Gratis
          </div>
        </div>
      </header>

      <main style={{ position:"relative", zIndex:1, maxWidth:820, margin:"0 auto", padding:"60px 20px 100px" }}>

        {/* ── Hero ── */}
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ marginBottom:20 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,45,85,.1)", border:"1px solid rgba(255,45,85,.2)", borderRadius:999, padding:"6px 16px", fontSize:12, fontWeight:600, color:"#ff8099", letterSpacing:".5px", textTransform:"uppercase" }}>
              ✦ Sin anuncios · Sin virus · Sin registro
            </span>
          </div>

          <h1 className="hero-title" style={{ fontFamily:"'Syne',sans-serif", fontSize:56, fontWeight:800, lineHeight:1.05, letterSpacing:"-2px", marginBottom:16 }}>
            Descarga TikToks<br/>
            <span className="shimmer-text">sin marca de agua</span>
          </h1>

          <p style={{ color:"#666", fontSize:16, maxWidth:420, margin:"0 auto", lineHeight:1.7 }}>
            Pega el link, descarga en segundos. Calidad HD. Audio MP3. Todo gratis.
          </p>
        </div>

        {/* ── Search Box ── */}
        <div style={{ maxWidth:680, margin:"0 auto 40px" }}>
          <div className="input-wrap" style={{ display:"flex", alignItems:"center", padding:"6px 6px 6px 20px", gap:8 }}>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleFetch()}
              placeholder="https://www.tiktok.com/@usuario/video/..."
              style={{
                flex:1, background:"none", border:"none", outline:"none",
                color:"#fff", fontSize:14, fontFamily:"'Space Grotesk',sans-serif",
                minWidth:0, padding:"6px 0"
              }}
            />
            <div className="input-row" style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              {url && <button className="btn-clear" onClick={() => { setUrl(""); setResult(null); setError(""); }}><IcX/></button>}
              <button className="btn-paste" onClick={handlePaste}>Pegar</button>
              <button className="btn-main" onClick={handleFetch} disabled={loading}>
                {loading ? <IcSpin/> : <IcDownload/>}
                <span>{loading ? "Buscando..." : "Descargar"}</span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginTop:12, background:"rgba(255,45,85,.08)", border:"1px solid rgba(255,45,85,.2)", borderRadius:12, padding:"12px 16px", color:"#ff8099", fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>⚠</span> {error}
            </div>
          )}
        </div>

        {/* ── Result Card ── */}
        {result && (
          <div className="result-card" style={{ maxWidth:680, margin:"0 auto 48px" }}>
            {/* Top: thumbnail + info */}
            <div style={{ display:"flex", gap:0 }}>
              {result.cover && (
                <div style={{ position:"relative", flexShrink:0, width:130 }}>
                  <img src={result.cover} alt="cover"
                    style={{ width:"100%", height:180, objectFit:"cover", display:"block" }}
                    onError={e => e.target.style.display="none"}/>
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,transparent 50%,#080810)" }}/>
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,#08081080,transparent)" }}/>
                </div>
              )}
              <div style={{ flex:1, padding:"20px 20px 16px" }}>
                {result.author && (
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
                    {result.author.avatar && (
                      <img src={result.author.avatar} alt="" style={{ width:34, height:34, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(255,45,85,.4)" }}
                        onError={e => e.target.style.display="none"}/>
                    )}
                    <div>
                      <div style={{ fontSize:14, fontWeight:600 }}>{result.author.nickname || "TikToker"}</div>
                      {result.author.unique_id && <div style={{ fontSize:11, color:"#555" }}>@{result.author.unique_id}</div>}
                    </div>
                  </div>
                )}
                {result.title && (
                  <p style={{ fontSize:13, color:"#888", lineHeight:1.55, marginBottom:14, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {result.title}
                  </p>
                )}
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {result.stats?.playCount > 0 && <span className="stat-tag">▶ {fmt(result.stats.playCount)}</span>}
                  {result.stats?.likeCount > 0 && <span className="stat-tag">♥ {fmt(result.stats.likeCount)}</span>}
                  {result.stats?.commentCount > 0 && <span className="stat-tag">💬 {fmt(result.stats.commentCount)}</span>}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height:1, background:"rgba(255,255,255,.06)" }}/>

            {/* Download buttons */}
            <div style={{ padding:"18px 20px" }}>
              <p style={{ fontSize:11, color:"#444", fontWeight:600, letterSpacing:".8px", textTransform:"uppercase", marginBottom:14 }}>
                Opciones de descarga
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                {(result.video?.noWatermark || result.links?.play) && (() => {
                  const u = result.video?.noWatermark || result.links?.play;
                  return (
                    <button className="dl-chip primary" onClick={() => downloadFile(u, "tikshak.mp4")} disabled={!!downloading[u]}>
                      {downloading[u] ? <IcSpin/> : <IcVideo/>}
                      {downloading[u] ? "Descargando..." : "Sin marca de agua"}
                    </button>
                  );
                })()}
                {result.video?.HD && (
                  <button className="dl-chip secondary" onClick={() => downloadFile(result.video.HD, "tikshak-hd.mp4")} disabled={!!downloading[result.video.HD]}>
                    {downloading[result.video.HD] ? <IcSpin/> : <IcHD/>}
                    {downloading[result.video.HD] ? "Descargando..." : "HD"}
                  </button>
                )}
                {result.video?.watermark && (
                  <button className="dl-chip secondary" onClick={() => downloadFile(result.video.watermark, "tikshak-wm.mp4")} disabled={!!downloading[result.video.watermark]}>
                    {downloading[result.video.watermark] ? <IcSpin/> : <IcVideo/>}
                    {downloading[result.video.watermark] ? "Descargando..." : "Con marca de agua"}
                  </button>
                )}
                {(result.music?.play || result.links?.music) && (() => {
                  const u = result.music?.play || result.links?.music;
                  return (
                    <button className="dl-chip secondary" onClick={() => downloadFile(u, "tikshak-audio.mp3")} disabled={!!downloading[u]}>
                      {downloading[u] ? <IcSpin/> : <IcMusic/>}
                      {downloading[u] ? "Descargando..." : "Audio MP3"}
                    </button>
                  );
                })()}
              </div>
              <p style={{ fontSize:11, color:"#333", marginTop:12 }}>
                Si el archivo abre en el navegador → mantén presionado → Guardar
              </p>
            </div>
          </div>
        )}

        {/* ── Features ── */}
        {!result && (
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <div className="features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:40 }}>
              {[
                { icon:"⚡", title:"Rápido", desc:"Descarga en segundos, sin esperas ni captchas." },
                { icon:"🎬", title:"Sin marca", desc:"Video limpio directo de TikTok, sin logos." },
                { icon:"🎵", title:"Audio MP3", desc:"Extrae el audio de cualquier video gratis." },
              ].map(f => (
                <div className="feature-card" key={f.title}>
                  <div style={{ fontSize:26, marginBottom:10 }}>{f.icon}</div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:6, fontFamily:"'Syne',sans-serif" }}>{f.title}</div>
                  <div style={{ fontSize:12, color:"#555", lineHeight:1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            {/* Steps */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <p style={{ fontSize:11, color:"#444", fontWeight:600, letterSpacing:".8px", textTransform:"uppercase", marginBottom:4 }}>Cómo usar</p>
              {[
                { n:"1", t:"Abre TikTok y elige un video", d:"Toca los tres puntos → Compartir → Copiar enlace." },
                { n:"2", t:"Pega el enlace arriba", d:'Toca el botón "Pegar" o pégalo manualmente en el campo.' },
                { n:"3", t:"Elige y descarga", d:"Selecciona la calidad que prefieras. El archivo se guarda directo." },
              ].map(s => (
                <div key={s.n} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 16px", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:14 }}>
                  <div className="step-num">{s.n}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, marginBottom:3 }}>{s.t}</div>
                    <div style={{ fontSize:13, color:"#555", lineHeight:1.55 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ position:"relative", zIndex:1, borderTop:"1px solid rgba(255,255,255,.05)", padding:"24px", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:8 }}>
          <Logo/>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16 }}>
            Tik<span style={{ color:"#ff2d55" }}>Shak</span>
          </span>
        </div>
        <p style={{ fontSize:12, color:"#333" }}>
          No almacenamos videos. Todo va directo desde TikTok a tu dispositivo.
        </p>
      </footer>
    </div>
  );
}
