const apiKey = '4a623e65c4294c4daec225448251306';

function obtenerClima() {
    const ciudad = document.getElementById('ciudadInput').value.trim();
    const mensaje = document.getElementById('mensaje');
    const loader = document.getElementById('cargando');
    const horaDiv = document.getElementById('horaLocal');
    loader.style.display = 'block';
    horaDiv.innerHTML = '';
    mensaje.innerHTML = '';
    document.getElementById('clima').innerHTML = '';

    if (ciudad === "") {
        alert("Por favor ingresa una ciudad");
        loader.style.display = 'none';
        return;
    }

    const ciudadCodificada = encodeURIComponent(ciudad);
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${ciudadCodificada}&lang=es`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            loader.style.display = 'none';

            if (data.error) {
                document.getElementById('clima').innerHTML = `<p>${data.error.message}</p>`;
                return;
            }

            let pais = data.location.country;
            if (data.location.name.toLowerCase() === "bogotá" && pais !== "Colombia") {
                pais = "Colombia";
            }

            const condicion = data.current.condition.text.toLowerCase();
            const isDay = data.current.is_day === 1;
            const claseIcono = isDay ? "clima-icono" : "clima-icono noche";

            // Obtener fecha y hora local
            const fechaHoraStr = data.location.localtime; // "YYYY-MM-DD HH:MM"
            const [fechaStr, horaStr] = fechaHoraStr.split(" ");

            const fechaObj = new Date(`${fechaStr}T${horaStr}`);

            const opcionesFecha = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };

            const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);
            const horaFormateada = fechaObj.toLocaleTimeString('es-CO', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            const mensajesPorClima = {
                "soleado": "☀️ ¡Día soleado y radiante! Ideal para salir y disfrutar del buen clima.",
                "lluvia moderada": "🌧️ Está cayendo una lluvia moderada. No olvides tu paraguas si vas a salir.",
                "lluvia ligera": "🌦️ Lluvias ligeras acompañan el día. Un paraguas será tu mejor aliado.",
                "lluvia fuerte": "⛈️ Lluvias fuertes en camino. Es mejor quedarse bajo techo si puedes.",
                "nublado": "☁️ Cielo nublado, sin sol a la vista. Tal vez sea un buen día para relajarse en casa.",
                "parcialmente nublado": "⛅ Algunas nubes cubren el cielo, pero el sol aún se deja ver. ¡Buen equilibrio!",
                "despejado": "🌞 Cielo despejado y sin una nube. ¡Perfecto para disfrutar al aire libre!",
                "nevando": "❄️ Está nevando. ¡Ambiente mágico! Abrígate bien si vas a salir.",
                "tormenta": "🌩️ Tormenta activa. Es recomendable mantenerse resguardado y evitar salir.",
                "bruma": "🌫️ Bruma densa. Maneja con cuidado y mantén las luces encendidas.",
                "cubierto": "🌥️ El cielo está completamente cubierto. Podrían venir lluvias más tarde."
            };

            const mensajeExtra = mensajesPorClima[condicion] || "🌡️ Consulta el clima antes de salir.";

            document.getElementById('clima').innerHTML = `
              <h2>Clima en ${data.location.name}, ${pais}</h2>
              <p>Temperatura: ${data.current.temp_c}°C</p>
              <p>Condición: ${data.current.condition.text}</p>
              <img src="https:${data.current.condition.icon}" class="${claseIcono}" alt="icono clima">
          `;

            mensaje.innerHTML = mensajeExtra;
            horaDiv.innerHTML = `📅 ${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}<br>🕒 Hora local: ${horaFormateada}`;
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error("Error:", error);
            document.getElementById('clima').innerHTML = "<p>Error al obtener datos del clima</p>";
        });
}

document.getElementById('ciudadInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        obtenerClima();
    }
});