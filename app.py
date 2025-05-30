import streamlit as st
import os
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic

# Cargar la API key
load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")

# Inicializar Claude
llm = ChatAnthropic(model="claude-3-haiku-20240307", api_key=api_key)

# Interfaz web
st.title("🤖 Chat con Claude")
st.write("Hazle una pregunta a Claude (Anthropic)")

# Entrada de usuario
pregunta = st.text_input("Tu mensaje:")

# Ejecutar cuando haya input
if pregunta:
    with st.spinner("Pensando..."):
        respuesta = llm.invoke(pregunta)
    st.success("Claude responde:")
    st.write(respuesta)
