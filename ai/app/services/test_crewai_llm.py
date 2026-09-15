from app.config.llm import llm


response = llm.call(
    "Explain what an AI agent is in one simple sentence."
)

print("CrewAI LLM response:")
print(response)