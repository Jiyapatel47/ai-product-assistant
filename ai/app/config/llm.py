import os

from dotenv import load_dotenv
from crewai import LLM


load_dotenv()


llm = LLM(
    model="groq/openai/gpt-oss-120b",
    api_key=os.getenv("GROQ_API_KEY")
)