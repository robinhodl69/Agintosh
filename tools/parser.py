import re

def extract_address(state):
    """
    Analiza el input del usuario para detectar si contiene una dirección Ethereum válida.
    Si encuentra una, la asigna al estado. Si no, lo marca como input conversacional.

    Este parser permite que el agente distinga entre una acción on-chain (consultar balances)
    y una conversación general (por ejemplo: 'hola, ¿qué puedes hacer?').
    """
    user_input = state.get("input", "")
    
    # Buscar direcciones Ethereum válidas (0x + 40 caracteres hexadecimales)
    matches = re.findall(r"0x[a-fA-F0-9]{40}", user_input)

    if matches:
        address = matches[0]
        print(f"📥 Dirección extraída del input: {address}")
        state["address"] = address
    else:
        print("❔ No se encontró dirección. Será manejado como input conversacional.")
        state["address"] = None  # Permite manejo flexible más adelante

    return state
