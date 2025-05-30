from typing import TypedDict
from langgraph.graph import StateGraph, END
from tools.mantle_tools import get_eth_and_token_balance
from tools.parser import extract_address
import re

class AgentState(TypedDict):
    input: str
    address: str
    mnt_balance: float
    weth_balance: float
    response: str  # nuevo campo opcional para mensajes libres

def start(state: AgentState) -> AgentState:
    user_input = state.get("input", "")
    eth_matches = re.findall(r"0x[a-fA-F0-9]{40}", user_input)

    if not eth_matches:
        state["response"] = "Por ahora solo puedo consultar balances en Mantle a partir de una dirección Ethereum. Pronto podré hacer más cosas 😉"
        return state  # early exit

    return state

graph = StateGraph(AgentState)
graph.add_node("start", start)
graph.add_node("parse_input", extract_address)
graph.add_node("get_balance", get_eth_and_token_balance)

graph.set_entry_point("start")
graph.add_conditional_edges(
    "start",
    lambda state: "response" in state,
    {
        True: END,
        False: "parse_input"
    }
)
graph.add_edge("parse_input", "get_balance")
graph.add_edge("get_balance", END)

agent = graph.compile()

if __name__ == "__main__":
    user_input = input("¿Qué quieres hacer? ")

    state = {
        "input": user_input,
        "address": "",
        "mnt_balance": 0.0,
        "weth_balance": 0.0,
    }

    result = agent.invoke(state)

    if "response" in result:
        print("💬 Agente:", result["response"])
    else:
        print("✅ Resultado:", result)
