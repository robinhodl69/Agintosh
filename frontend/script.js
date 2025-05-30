async function enviarMensajeAlAgente(mensaje) {
  const response = await fetch("http://127.0.0.1:7860/", {
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
