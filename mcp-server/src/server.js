import express from "express";

const app = express();
app.use(express.json());

app.post("/tool/get_weather", async (req, res) => {
  const { city } = req.body;

  res.json({
    city,
    temperature: 16,
    condition: "Nublado"
  });
});

app.post("/tool/recommend_outfit", async (req, res) => {
  const { temperature, condition } = req.body;

  let recommendation = "";

  if (temperature < 10) {
    recommendation = "Usa abrigo grueso.";
  } else if (temperature < 18) {
    recommendation = "Usa chaqueta ligera.";
  } else if (temperature < 26) {
    recommendation = "Usa ropa cómoda.";
  } else {
    recommendation = "Usa ropa fresca.";
  }

  if ((condition || "").toLowerCase().includes("lluvia")) {
    recommendation += " Lleva paraguas.";
  }

  res.json({ recommendation });
});

app.listen(4000, () => {
  console.log("MCP server running on port 4000");
});