import json
import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def analyze_feedback(feedback_texts: list[str]):

    feedback_list = "\n".join(
        f"{index + 1}. {text}"
        for index, text in enumerate(feedback_texts)
    )

    prompt = f"""
You are an expert Product Manager.

Analyze the following customer feedback.

Your task:
1. Group similar feedback into common problems.
2. Give each problem a short title.
3. Explain the problem briefly.
4. Count how many feedback items belong to each problem.
5. Assign priority: High, Medium, or Low.
6. Give the feedback numbers belonging to each problem.

Customer feedback:

{feedback_list}

Return ONLY valid JSON in this exact format:

{{
  "problems": [
    {{
      "title": "Payment Issues",
      "description": "Users are having difficulty completing payments.",
      "count": 2,
      "priority": "High",
      "feedback_numbers": [1, 2]
    }}
  ]
}}
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    result = response.output_text

    return json.loads(result)