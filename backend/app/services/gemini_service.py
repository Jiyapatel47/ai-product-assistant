import os
import json

from dotenv import load_dotenv
from google import genai


load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# ==========================================
# AI Feedback Analysis
# Theme Extraction & Pain Point Identification
# ==========================================

def analyze_feedback(feedback_list):

    feedback_text = "\n".join(
        f"- {feedback}"
        for feedback in feedback_list
    )

    prompt = f"""
You are an AI Product Manager Assistant.

Analyze the following customer feedback and identify recurring themes,
customer pain points, feature requests, priorities, and recommendations.

Customer Feedback:
{feedback_text}

Your tasks:

1. Identify the most important customer pain points.
2. Group similar feedback into common themes.
3. Identify feature requests if present.
4. Determine priority based on frequency and business impact.
5. Provide actionable product recommendations.

Return ONLY valid JSON in exactly this format:

{{
  "problems": [
    {{
      "pain_point": "...",
      "description": "...",
      "severity": "High/Medium/Low",
      "frequency": 0
    }}
  ],

  "themes": [
    {{
      "theme": "...",
      "description": "...",
      "feedback_count": 0
    }}
  ],

  "feature_requests": [
    {{
      "feature": "...",
      "description": "..."
    }}
  ],

  "priorities": [
    {{
      "issue": "...",
      "priority": "High/Medium/Low",
      "reason": "..."
    }}
  ],

  "recommendations": [
    "..."
  ]
}}

Rules:
- Identify recurring patterns across feedback.
- Group similar complaints under one theme.
- frequency and feedback_count must be numbers.
- Keep descriptions concise.
- Maximum 5 items per section.
- Do not include markdown.
- Do not include ```json.
- Return only valid JSON.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        response_text = response.text.strip()

        # Remove markdown code blocks if AI returns them
        if response_text.startswith("```json"):
            response_text = response_text.replace(
                "```json", ""
            ).replace(
                "```", ""
            ).strip()

        elif response_text.startswith("```"):
            response_text = response_text.replace(
                "```", ""
            ).strip()

        return json.loads(response_text)

    except json.JSONDecodeError as e:
        raise Exception(
            f"Invalid JSON response from AI: {str(e)}"
        )

    except Exception as e:
        raise Exception(
            f"Gemini analysis error: {str(e)}"
        )