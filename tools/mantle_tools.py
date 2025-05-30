from web3 import Web3
import os
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()
MANTLE_RPC = os.getenv("MANTLE_RPC")

# Conexión Web3
w3 = Web3(Web3.HTTPProvider(MANTLE_RPC))
print("🧪 Endpoint activo realmente:", w3.provider.endpoint_uri)

# ABI básico para balanceOf (ERC20)
ERC20_ABI = [
    {
        "constant": True,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function",
    }
]

# Dirección de WETH en Mantle Testnet
WETH_ADDRESS = "0x4200000000000000000000000000000000000006"

def get_eth_and_token_balance(state):
    address = state.get("address")

    # Si no hay dirección, el usuario no pidió un balance. Solo devuelve el estado como está.
    if not address:
        print("💬 No hay dirección. Saltando verificación de balances.")
        state["mnt_balance"] = None
        state["weth_balance"] = None
        return state

    if not w3.is_address(address):
        raise ValueError(f"❌ Dirección inválida: {address}")

    # Balance en MNT
    balance_wei = w3.eth.get_balance(address)
    balance_eth = w3.from_wei(balance_wei, 'ether')
    state["mnt_balance"] = float(balance_eth)
    print(f"🪙 MNT balance: {state['mnt_balance']}")

    # Balance de WETH
    weth_contract = w3.eth.contract(address=WETH_ADDRESS, abi=ERC20_ABI)
    weth_raw = weth_contract.functions.balanceOf(address).call()
    weth_balance = w3.from_wei(weth_raw, 'ether')
    state["weth_balance"] = float(weth_balance)
    print(f"💧 WETH balance: {state['weth_balance']}")

    return state
