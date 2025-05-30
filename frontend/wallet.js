// wallet.js

let currentAddress = null;

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      currentAddress = accounts[0];

      // ✅ Solo actualiza el botón
      const btn = document.getElementById('connectBtn');
      btn.innerText = `🦊 Connected ${currentAddress}`;
      btn.disabled = true;
      btn.style.cursor = "default";

      // ❌ Oculta el texto duplicado
      document.getElementById('walletAddress').style.display = "none";

    } catch (err) {
      alert('❌ Error al conectar: ' + err.message);
    }
  } else {
    alert('🦊 MetaMask no está disponible. Instálalo desde https://metamask.io');
  }
}

// Enviar transferencia de MNT usando parámetros directos
async function sendTransfer(to, amountEth) {
  if (!window.ethereum) {
    alert('🦊 MetaMask no está disponible.');
    return;
  }

  if (!currentAddress) {
    alert('🔌 Primero conecta tu wallet.');
    return;
  }

  if (!to || !amountEth || parseFloat(amountEth) <= 0) {
    alert('🚨 Dirección inválida o monto menor o igual a 0.');
    return;
  }

  try {
    const weiValue = (BigInt(parseFloat(amountEth) * 1e18)).toString();
    const tx = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: currentAddress,
        to,
        value: '0x' + BigInt(weiValue).toString(16)
      }]
    });

    alert(`✅ Transferencia enviada.\n\nTX hash: ${tx}\n\n🔗 https://explorer.mantle.xyz/tx/${tx}`);
  } catch (err) {
    alert('❌ Error al enviar: ' + err.message);
  }
}
