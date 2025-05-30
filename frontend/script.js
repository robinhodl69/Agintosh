const BACKEND_URL = "https://af7fce42afdf46feaa.gradio.live/";  // Actualiza esta URL si reinicias Gradio

// Verifica el estado del agente al cargar
async function checkAgentStatus() {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: ["estado"] })  // Mensaje dummy
    });

    if (res.ok) {
      document.getElementById("agentStatus").textContent = "🟢 Agente Online";
    } else {
      throw new Error("Sin respuesta válida");
    }
  } catch {
    document.getElementById("agentStatus").textContent = "🔴 Agente Offline";
  }
}

// Llama esta función al cargar la página
window.onload = () => {
  checkAgentStatus();
  document.getElementById("connectBtn").onclick = connectWallet;
};

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
      alert("🤖 Agente: " + parsed.response);
    } else if (parsed.type === "action" && parsed.action === "transfer") {
      alert(`🤖 Agente solicita enviar ${parsed.amount} MNT a ${parsed.to}`);
      document.getElementById("recipient").value = parsed.to;
      document.getElementById("amount").value = parsed.amount;
      sendTransfer(); // Ejecuta automáticamente
    }
  } catch (err) {
    alert("❌ Error al comunicar con el agente: " + err.message);
  }
}
