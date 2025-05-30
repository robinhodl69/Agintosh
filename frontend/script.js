const BACKEND_URL = "https://348b2d4aaf50d05179.gradio.live/api/predict/"; // Reemplaza si cambias de link

// Verifica el estado del agente al cargar
async function checkAgentStatus() {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: ["estado"] })  // Mensaje dummy
    });

    const status = document.getElementById("agentStatus");
    if (res.ok) {
      status.textContent = "🟢 Agente Online";
    } else {
      throw new Error("Sin respuesta válida");
    }
  } catch {
    document.getElementById("agentStatus").textContent = "🔴 Agente Offline";
  }
}

// Función principal para enviar mensajes al agente
async function enviarMensajeAlAgente(mensaje) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [mensaje] })
    });

    const result = await response.json();
    const parsed = result.data[0];

    if (parsed.type === "text") {
      addMessage("🤖 " + parsed.response, "agent");
    } else if (parsed.type === "action" && parsed.action === "transfer") {
      addMessage(`🤖 Transferencia solicitada: ${parsed.amount} MNT a ${parsed.to}`, "agent");
      document.getElementById("recipient").value = parsed.to;
      document.getElementById("amount").value = parsed.amount;
      sendTransfer(); // Ejecuta automáticamente
    }
  } catch (err) {
    addMessage("❌ Error al comunicar con el agente: " + err.message, "agent");
  }
}

// Agrega mensaje al contenedor
function addMessage(text, type) {
  const container = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'message ' + type;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// Escucha input del usuario
async function handleUserInput() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message) return;

  addMessage("🧑‍💻 " + message, "user");
  input.value = "";
  await enviarMensajeAlAgente(message);
}

// Inicialización
window.onload = () => {
  checkAgentStatus();
  document.getElementById("connectBtn").onclick = connectWallet;
};
