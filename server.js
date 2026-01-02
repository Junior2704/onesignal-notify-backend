import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/notify", async (req, res) => {
  const { doctorId, title, message } = req.body;

  if (!doctorId) {
    return res.status(400).json({ error: "doctorId manquant" });
  }

  try {
    const r = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${process.env.ONESIGNAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        include_external_user_ids: [doctorId],
        headings: { fr: title || "🩺 Mise à jour patient" },
        contents: { fr: message || "Changement détecté" }
      })
    });

    const data = await r.json();
    res.json({ ok: true, onesignal: data });

  } catch (e) {
    res.status(500).json({ error: "Erreur OneSignal" });
  }
});

app.listen(3000, () => {
  console.log("Backend notifications prêt");
});
