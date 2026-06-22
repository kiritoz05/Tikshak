export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL requerida" });

  // Intentamos con múltiples APIs en orden
  const apis = [
    `https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`,
    `https://api.tiklydown.eu.org/api/download/v3?url=${encodeURIComponent(url)}`,
  ];

  for (const apiUrl of apis) {
    try {
      const r = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Referer": "https://tikwm.com/",
        },
      });
      if (!r.ok) continue;
      const raw = await r.json();

      // Normalizar respuesta de tikwm.com
      if (raw.data && raw.code === 0) {
        return res.status(200).json({
          title: raw.data.title,
          cover: raw.data.cover,
          author: {
            nickname: raw.data.author?.nickname,
            unique_id: raw.data.author?.unique_id,
            avatar: raw.data.author?.avatar,
          },
          stats: {
            playCount: raw.data.play_count,
            likeCount: raw.data.digg_count,
            commentCount: raw.data.comment_count,
            shareCount: raw.data.share_count,
          },
          video: {
            noWatermark: raw.data.play,
            HD: raw.data.hdplay,
            watermark: raw.data.wmplay,
          },
          music: { play: raw.data.music },
        });
      }

      // tiklydown formato original
      if (raw && raw.status !== false) {
        return res.status(200).json(raw);
      }
    } catch (e) {
      continue;
    }
  }

  return res.status(500).json({ error: "No se pudo obtener el video. Intenta con otro enlace." });
}
