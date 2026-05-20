export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Falta el parámetro url" });

  try {
    const response = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `url=${encodeURIComponent(url)}&hd=1`,
    });
    const json = await response.json();

    if (!json || json.code !== 0) {
      return res.status(400).json({ error: "No se pudo obtener el video." });
    }

    const d = json.data;
    res.status(200).json({
      title: d.title,
      cover: d.cover,
      author: { nickname: d.author?.nickname, unique_id: d.author?.unique_id, avatar: d.author?.avatar },
      video: { noWatermark: d.play, HD: d.hdplay, watermark: d.wmplay },
      music: { play: d.music },
      stats: { likeCount: d.digg_count, commentCount: d.comment_count, shareCount: d.share_count, playCount: d.play_count },
    });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor." });
  }
              }
