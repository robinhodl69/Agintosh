// Verifica el estado del agente al cargar
async function checkAgentStatus() {
  try {
    const res = await fetch("https://99ea-2806-102e-12-7f5d-9c2a-14bc-a6cf-9a0.ngrok-free.app/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: ["estado"] })  // mensaje dummy
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

// Llama esta función cuando se cargue la página
window.onload = () => {
  checkAgentStatus();
  document.getElementById("connectBtn").onclick = connectWallet;
};

// Función principal para enviar mensajes
async function enviarMensajeAlAgente(mensaje) {
  const response = await fetch("https://99ea-2806-102e-12-7f5d-9c2a-14bc-a6cf-9a0.ngrok-free.app/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
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
    sendTransfer(); // ejecuta la transferencia automáticamente
  }
}
