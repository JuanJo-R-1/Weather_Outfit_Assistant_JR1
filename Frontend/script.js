async function consultWeather() {

    const city = document.getElementById("cityInput").value;
  
    if (!city) {
      alert("Por favor ingresa una ciudad");
      return;
    }
  
    try {
  
      const response = await fetch("http://localhost:3001/api/weather-outfit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ city: city })
      });
  
      const data = await response.json();
  
      document.getElementById("city").textContent = data.city;
      document.getElementById("temperature").textContent =
        "Temperatura: " + data.temperature + "°C";
  
      document.getElementById("condition").textContent =
        "Condición: " + data.condition;
  
      document.getElementById("recommendation").textContent =
        "Recomendación: " + data.recommendation;
  
      document.getElementById("result").classList.remove("hidden");
  
    } catch (error) {
  
      console.error(error);
      alert("Error al consultar el clima");
  
    }
  }