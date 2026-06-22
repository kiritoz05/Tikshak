import { useState } from "react";

const API_BASE = "/api/download";

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const MusicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:"spin 0.8s linear infinite"}}>
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const TikTokLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z"/>
  </svg>
);

export default function TikTokDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState({});

  const downloadFile = async (fileUrl, filename) => {
    const key = fileUrl;
    setDownloading(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Error al descargar");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      // Fallback: abrir en nueva pestaña
      window.open(fileUrl, "_blank");
    } finally {
      setDownloading(prev => ({ ...prev, [key]: false }));
    }
  };

  const isValidTikTokUrl = (u) =>
    /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/.test(u);

  const handleDownload = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Por favor pega un enlace de TikTok."); return; }
    if (!isValidTikTokUrl(trimmed)) { setError("El enlace no parece ser de TikTok. Verifica e intenta de nuevo."); return; }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}?url=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      const data = await res.json();

      if (!data || data.status === false) throw new Error("No se pudo obtener el video. Verifica el enlace.");

      setResult(data);
    } catch (e) {
      setError(e.message || "Ocurrió un error inesperado. Intenta con otro enlace.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError("");
    } catch {
      setError("No se pudo acceder al portapapeles. Pega manualmente.");
    }
  };

  const clear = () => { setUrl(""); setResult(null); setError(""); };

  const formatNumber = (n) => {
    if (!n) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",fontFamily:"'Outfit',sans-serif",color:"#fff"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        @keyframes gradientShift {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:#ff2d55; color:#fff; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#111; }
        ::-webkit-scrollbar-thumb { background:#333; border-radius:3px; }
        .input-box {
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-box:focus-within {
          border-color: #ff2d55 !important;
          box-shadow: 0 0 0 3px rgba(255,45,85,0.15) !important;
        }
        .dl-btn {
          transition: transform 0.15s, background 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .dl-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255,45,85,0.4);
        }
        .dl-btn:active:not(:disabled) { transform: translateY(0); }
        .dl-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .icon-btn {
          background:none; border:none; cursor:pointer;
          color:#888; transition:color 0.15s;
        }
        .icon-btn:hover { color:#fff; }
        .card {
          animation: fadeUp 0.4s ease both;
          background: #141414;
          border: 1px solid #222;
          border-radius: 16px;
          overflow: hidden;
        }
        .video-chip {
          display:inline-flex; align-items:center; gap:6px;
          background:#1e1e1e; border:1px solid #2a2a2a;
          border-radius:8px; padding:8px 14px; font-size:13px;
          color:#ccc; text-decoration:none;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          cursor:pointer; font-family:'Outfit',sans-serif;
        }
        .video-chip:hover {
          background:#252525; border-color:#ff2d55; color:#fff;
        }
        .video-chip:disabled { opacity:0.6; cursor:not-allowed; }
        .video-chip:disabled:hover { background:#1e1e1e; border-color:#2a2a2a; color:#ccc; }
        .video-chip.primary {
          background: linear-gradient(135deg,#ff2d55,#ff6b35);
          border-color:transparent; color:#fff;
        }
        .video-chip.primary:hover {
          filter:brightness(1.1);
          border-color:transparent;
        }
        .stat-pill {
          background:#1a1a1a; border:1px solid #222; border-radius:999px;
          padding:5px 12px; font-size:12px; color:#999;
          display:inline-flex; align-items:center; gap:5px;
        }
        .steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        @media(max-width:600px) { .steps-grid { grid-template-columns:1fr; } }
      `}</style>

      {/* Header */}
      <header style={{borderBottom:"1px solid #161616",padding:"0 24px"}}>
        <div style={{maxWidth:760,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{color:"#ff2d55"}}><TikTokLogo/></div>
            <span style={{fontWeight:700,fontSize:17,letterSpacing:"-0.3px"}}>
              TikSave<span style={{color:"#ff2d55"}}>.</span>
            </span>
          </div>
          <span style={{fontSize:12,color:"#444",background:"#111",border:"1px solid #222",borderRadius:6,padding:"4px 10px"}}>
            Sin anuncios · Sin registro
          </span>
        </div>
      </header>

      <main style={{maxWidth:760,margin:"0 auto",padding:"48px 24px 80px"}}>

        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{
            display:"inline-block",marginBottom:16,
            background:"linear-gradient(135deg,#ff2d55 0%,#ff6b35 100%)",
            backgroundSize:"200% 200%",
            animation:"gradientShift 4s ease infinite",
            borderRadius:14,padding:"8px 18px",
            fontSize:12,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"
          }}>
            Descargador gratuito
          </div>
          <h1 style={{fontSize:"clamp(28px,6vw,46px)",fontWeight:800,lineHeight:1.1,letterSpacing:"-1px",marginBottom:12}}>
            Descarga TikToks<br/>
            <span style={{
              background:"linear-gradient(90deg,#ff2d55,#ff9500)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
            }}>sin marca de agua</span>
          </h1>
          <p style={{color:"#666",fontSize:15,maxWidth:440,margin:"0 auto"}}>
            Pega el enlace, descarga en segundos. Sin anuncios, sin virus, sin registro.
          </p>
        </div>

        {/* Input */}
        <div className="input-box" style={{
          display:"flex",alignItems:"center",gap:0,
          background:"#111",border:"1px solid #222",borderRadius:14,
          padding:"6px 6px 6px 18px",marginBottom:error?"12px":"32px"
        }}>
          <input
            value={url}
            onChange={e=>{setUrl(e.target.value);setError("");}}
            onKeyDown={e=>e.key==="Enter"&&handleDownload()}
            placeholder="https://www.tiktok.com/@usuario/video/..."
            style={{
              flex:1,background:"none",border:"none",outline:"none",
              color:"#fff",fontSize:14,fontFamily:"'Outfit',sans-serif",
              minWidth:0
            }}
          />
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            {url && (
              <button className="icon-btn" onClick={clear} style={{padding:"6px"}}>
                <XIcon/>
              </button>
            )}
            <button
              className="icon-btn"
              onClick={handlePaste}
              style={{
                padding:"8px 12px",fontSize:12,fontWeight:600,
                color:"#888",borderRadius:8,
                border:"1px solid #222",background:"#161616"
              }}
            >
              Pegar
            </button>
            <button
              className="dl-btn"
              onClick={handleDownload}
              disabled={loading}
              style={{
                background:"linear-gradient(135deg,#ff2d55,#e0003a)",
                color:"#fff",border:"none",borderRadius:10,
                padding:"10px 20px",fontWeight:700,fontSize:14,
                fontFamily:"'Outfit',sans-serif",
                display:"flex",alignItems:"center",gap:8
              }}
            >
              {loading ? <><SpinnerIcon/> Buscando...</> : <><DownloadIcon/> Descargar</>}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:"rgba(255,45,85,0.08)",border:"1px solid rgba(255,45,85,0.25)",
            borderRadius:10,padding:"12px 16px",marginBottom:28,
            color:"#ff6b6b",fontSize:14,display:"flex",alignItems:"center",gap:8
          }}>
            <span>⚠</span> {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="card" style={{marginBottom:32}}>
            {/* Thumbnail + info */}
            <div style={{display:"flex",gap:0,flexWrap:"wrap"}}>
              {result.cover && (
                <div style={{position:"relative",flexShrink:0}}>
                  <img
                    src={result.cover}
                    alt="thumbnail"
                    style={{width:140,height:190,objectFit:"cover",display:"block"}}
                    onError={e=>{e.target.style.display="none";}}
                  />
                  <div style={{
                    position:"absolute",inset:0,
                    background:"linear-gradient(to right,transparent 60%,#141414)"
                  }}/>
                </div>
              )}
              <div style={{flex:1,padding:"20px 20px 20px",minWidth:200}}>
                {result.author && (
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    {result.author.avatar && (
                      <img src={result.author.avatar} alt="" style={{width:32,height:32,borderRadius:"50%",objectFit:"cover"}}
                        onError={e=>e.target.style.display="none"}/>
                    )}
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>{result.author.nickname || result.author.unique_id || "TikToker"}</div>
                      {result.author.unique_id && (
                        <div style={{fontSize:11,color:"#555"}}>@{result.author.unique_id}</div>
                      )}
                    </div>
                  </div>
                )}
                {result.title && (
                  <p style={{fontSize:13,color:"#aaa",lineHeight:1.5,marginBottom:14,
                    display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                    {result.title}
                  </p>
                )}
                {/* Stats */}
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
                  {result.stats?.playCount > 0 && <span className="stat-pill">▶ {formatNumber(result.stats.playCount)}</span>}
                  {result.stats?.likeCount > 0 && <span className="stat-pill">♥ {formatNumber(result.stats.likeCount)}</span>}
                  {result.stats?.commentCount > 0 && <span className="stat-pill">💬 {formatNumber(result.stats.commentCount)}</span>}
                  {result.stats?.shareCount > 0 && <span className="stat-pill">↗ {formatNumber(result.stats.shareCount)}</span>}
                </div>
              </div>
            </div>

            {/* Download options */}
            <div style={{borderTop:"1px solid #1e1e1e",padding:"20px"}}>
              <p style={{fontSize:12,color:"#555",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600}}>
                Opciones de descarga
              </p>
              <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                {/* No watermark video */}
                {(result.video?.noWatermark || result.links?.play) && (() => {
                  const dlUrl = result.video?.noWatermark || result.links?.play;
                  return (
                    <button
                      className="video-chip primary"
                      onClick={() => downloadFile(dlUrl, "tikshan-video.mp4")}
                      disabled={downloading[dlUrl]}
                    >
                      {downloading[dlUrl] ? <><SpinnerIcon/> Descargando...</> : <><VideoIcon/> Video sin marca de agua</>}
                    </button>
                  );
                })()}
                {/* HD */}
                {result.video?.HD && (
                  <button
                    className="video-chip"
                    onClick={() => downloadFile(result.video.HD, "tikshan-hd.mp4")}
                    disabled={downloading[result.video.HD]}
                  >
                    {downloading[result.video.HD] ? <><SpinnerIcon/> Descargando...</> : <><VideoIcon/> Video HD</>}
                  </button>
                )}
                {/* Watermark version */}
                {result.video?.watermark && (
                  <button
                    className="video-chip"
                    onClick={() => downloadFile(result.video.watermark, "tikshan-wm.mp4")}
                    disabled={downloading[result.video.watermark]}
                  >
                    {downloading[result.video.watermark] ? <><SpinnerIcon/> Descargando...</> : <><VideoIcon/> Con marca de agua</>}
                  </button>
                )}
                {/* Music */}
                {(result.music?.play || result.links?.music) && (() => {
                  const musicUrl = result.music?.play || result.links?.music;
                  return (
                    <button
                      className="video-chip"
                      onClick={() => downloadFile(musicUrl, "tikshan-audio.mp3")}
                      disabled={downloading[musicUrl]}
                    >
                      {downloading[musicUrl] ? <><SpinnerIcon/> Descargando...</> : <><MusicIcon/> Audio MP3</>}
                    </button>
                  );
                })()}
              </div>
              <p style={{fontSize:11,color:"#444",marginTop:12}}>
                ⬇️ El archivo se descarga directo a tu dispositivo
              </p>
            </div>
          </div>
        )}

        {/* How to use */}
        {!result && !loading && (
          <div style={{marginTop:8}}>
            <p style={{fontSize:12,color:"#444",textAlign:"center",textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:20,fontWeight:600}}>
              Cómo funciona
            </p>
            <div className="steps-grid">
              {[
                {n:"01",title:"Copia el enlace",desc:"Abre TikTok, toca Compartir → Copiar enlace en cualquier video."},
                {n:"02",title:"Pega aquí",desc:"Pega el enlace en el campo de arriba y presiona Descargar."},
                {n:"03",title:"Descarga gratis",desc:"Elige la calidad y descarga directo a tu dispositivo. Sin registro."},
              ].map(s=>(
                <div key={s.n} style={{background:"#0f0f0f",border:"1px solid #1a1a1a",borderRadius:12,padding:"20px"}}>
                  <div style={{
                    fontFamily:"monospace",fontSize:11,color:"#ff2d55",fontWeight:700,
                    letterSpacing:"1px",marginBottom:10
                  }}>{s.n}</div>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:6}}>{s.title}</div>
                  <div style={{fontSize:13,color:"#555",lineHeight:1.6}}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer style={{borderTop:"1px solid #111",padding:"20px 24px",textAlign:"center"}}>
        <p style={{fontSize:12,color:"#333"}}>
          No almacenamos ningún video. Los archivos provienen directamente de los servidores de TikTok.
        </p>
      </footer>
    </div>
  );
}
