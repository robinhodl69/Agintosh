import os
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic  # ← nueva fuente oficial

# Cargar tu API key
load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")
print(f"🧪 API key detectada: {api_key[:10]}...")

# Crear el modelo Claude con el nuevo paquete
llm = ChatAnthropic(model="claude-3-haiku-20240307", api_key=api_key)

# Probar
respuesta = llm.invoke("¿Qué es una blockchain?")
print("🧠 Claude responde:", respuesta)
