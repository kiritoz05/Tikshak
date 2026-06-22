export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL requerida" });

  try {
    const response = await fetch(
      `https://api.tiklydown.eu.org/api/download/v3?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Error al contactar la API" });
  }
}
