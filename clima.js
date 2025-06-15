const apiKey = '4a623e65c4294c4daec225448251306';

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function obtenerDepartamento(ciudad) {
    const ciudadNormalizada = normalizarTexto(ciudad);
    const capitalesEspeciales = {
        "bogota": "Bogotá D.C., Cundinamarca",
        "san andres": "San Andrés y Providencia",
        "providencia": "San Andrés y Providencia"
    };

    if (capitalesEspeciales[ciudadNormalizada]) return capitalesEspeciales[ciudadNormalizada];

    const index = ciudades.findIndex(item => normalizarTexto(item) === ciudadNormalizada);
    if (index > 0) {
        for (let i = index - 1; i >= 0; i--) {
            if (ciudades[i][0] === ciudades[i][0].toUpperCase()) {
                return ciudades[i];
            }
        }
    }

    return "Departamento no encontrado";
}

function obtenerClima() {
    const ciudad = document.getElementById('ciudadInput').value.trim();
    const mensaje = document.getElementById('mensaje');
    const loader = document.getElementById('cargando');
    const horaDiv = document.getElementById('horaLocal');
    const climaDiv = document.getElementById('clima');

    mensaje.textContent = "";
    horaDiv.innerHTML = "";
    climaDiv.innerHTML = "";
    loader.style.display = 'block';

    if (ciudad === "") {
        alert("Por favor ingresa una ciudad");
        loader.style.display = 'none';
        return;
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(ciudad)}&lang=es`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            loader.style.display = 'none';

            if (data.error) {
                climaDiv.innerHTML = `<p>${data.error.message}</p>`;
                return;
            }

            const condicion = data.current.condition.text.toLowerCase();
            const iconoClase = data.current.is_day ? "clima-icono" : "clima-icono noche";
            const [fechaStr, horaStr] = data.location.localtime.split(" ");
            const fechaObj = new Date(`${fechaStr}T${horaStr}`);
            const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            const horaFormateada = fechaObj.toLocaleTimeString('es-CO', {
                hour: 'numeric', minute: '2-digit', hour12: true
            });

            const mensajes = {
                "soleado": "☀️ ¡Día soleado y radiante!",
                "lluvia moderada": "🌧️ Está lloviendo moderadamente.",
                "lluvia ligera": "🌦️ Lluvia ligera presente.",
                "lluvia fuerte": "⛈️ Mucha lluvia. ¡Ten cuidado!",
                "nublado": "☁️ Día nublado.",
                "parcialmente nublado": "⛅ Nubes y claros.",
                "despejado": "🌞 Cielo totalmente despejado.",
                "nevando": "❄️ Está nevando.",
                "tormenta": "🌩️ Hay tormenta.",
                "bruma": "🌫️ Bruma densa.",
                "cubierto": "🌥️ Cielo cubierto."
            };

            const mensajeExtra = mensajes[condicion] || "🌡️ Consulta el clima antes de salir.";
            const departamento = obtenerDepartamento(data.location.name);
            const pais = data.location.country === "Colombia" ? "Colombia" : data.location.country;

            climaDiv.innerHTML = `
                <h2>${data.location.name}, ${departamento}</h2>
                <p><strong>País:</strong> ${pais}</p>
                <p><strong>Temperatura:</strong> ${data.current.temp_c}°C</p>
                <p><strong>Condición:</strong> ${data.current.condition.text}</p>
                <img src="https:${data.current.condition.icon}" class="${iconoClase}" alt="icono clima">
            `;

            mensaje.textContent = mensajeExtra;
            horaDiv.innerHTML = `📅 ${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}<br>🕒 Hora local: ${horaFormateada}`;
        })
        .catch(err => {
            loader.style.display = 'none';
            climaDiv.innerHTML = "<p>Error al obtener datos del clima.</p>";
            console.error(err);
        });
}

document.getElementById('ciudadInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') obtenerClima();
});

// ------------------------- Autocompletado -------------------------

const ciudades = [
  "Bogotá", "Cundinamarca", "Medellín", "Antioquia", "Cali", "Valle del Cauca",
  "Barranquilla", "Atlántico", "Cartagena", "Bolívar", "Cúcuta", "Norte de Santander",
  "Bucaramanga", "Santander", "Pereira", "Risaralda", "Manizales", "Caldas", "Ibagué", "Tolima",
  "Santa Marta", "Magdalena", "Villavicencio", "Meta", "Neiva", "Huila", "Armenia", "Quindío",
  "Sincelejo", "Sucre", "San Andrés", "Providencia"
];

const inputCiudad = document.getElementById("ciudadInput");
const listaSugerencias = document.getElementById("listaSugerencias");

inputCiudad.addEventListener("input", () => {
    const valor = inputCiudad.value.toLowerCase();
    listaSugerencias.innerHTML = "";

    if (!valor) {
        listaSugerencias.style.display = "none";
        return;
    }

    const sugerencias = ciudades.filter(ciudad =>
        ciudad.toLowerCase().startsWith(valor)
    );

    if (sugerencias.length === 0) {
        listaSugerencias.style.display = "none";
        return;
    }

    sugerencias.forEach(ciudad => {
        const li = document.createElement("li");
        li.textContent = ciudad;
        li.addEventListener("click", () => {
            inputCiudad.value = ciudad;
            listaSugerencias.innerHTML = "";
            listaSugerencias.style.display = "none";
        });
        listaSugerencias.appendChild(li);
    });

    listaSugerencias.style.display = "block";
});

document.addEventListener("click", (e) => {
    if (!document.querySelector(".buscador").contains(e.target)) {
        listaSugerencias.style.display = "none";
    }
});
