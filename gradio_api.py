import gradio as gr
from agent import agent
from tools.parser import extract_address
from langchain_anthropic import ChatAnthropic
import re

llm = ChatAnthropic(model="claude-3-haiku-20240307")

def chat_interface(message):
    # ✅ Detección robusta de intención de transferencia (incluye "manda" y "transferir")
    intent_words = ["transferir", "transfiere", "manda", "enviar", "envía"]
    if any(word in message.lower() for word in intent_words) and "0x" in message:
        to_match = re.search(r"0x[a-fA-F0-9]{40}", message)
        amount_match = re.search(r"(\d+(\.\d+)?)", message)
        if to_match and amount_match:
            return {
                "type": "action",
                "action": "transfer",
                "to": to_match.group(),
                "amount": float(amount_match.group())
            }

    # 🧠 Ejecutar agente solo si no es transferencia
    state = {
        "input": message,
        "address": "",
        "mnt_balance": 0.0,
        "weth_balance": 0.0
    }

    result = agent.invoke(state)

    if "response" in result:
        prompt = f"El usuario escribió: '{message}'\n\nResponde como un asistente retro amigable que está aprendiendo funciones Web3. Sé breve, directo y simpático."
        response = llm.invoke(prompt)
        return {
            "type": "text",
            "response": str(response.content)
        }

    return {
        "type": "text",
        "response": f"📍 Dirección: {result['address']}\n\n"
                   f"MNT: {result.get('mnt_balance', 'N/A')}\n"
                   f"🔵 WETH: {result.get('weth_balance', 'N/A')}"
    }

demo = gr.Interface(
    fn=chat_interface,
    inputs="text",
    outputs="json"
)

if __name__ == "__main__":
    print("🧪 Servidor Gradio JSON corriendo en http://127.0.0.1:7860/")
    # demo.launch(server_name="127.0.0.1", server_port=7860) 
    demo.launch(share=True)
    
