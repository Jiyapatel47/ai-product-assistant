import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_feedback(feedback_list):

    feedback_text = "\n".join(
        f"- {feedback}" for feedback in feedback_list
    )

    prompt = f"""Analyze these customer feedback items as a Product Manager.

Feedback:
{feedback_text}

Return ONLY valid JSON:

{{
  "problems": ["..."],
  "themes": ["..."],
  "feature_requests": ["..."],
  "priorities": [
    {{
      "issue": "...",
      "priority": "High/Medium/Low",
      "reason": "..."
    }}
  ],
  "recommendations": ["..."]
}}

Keep each item concise. Maximum 5 items per list.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return json.loads(response.text)