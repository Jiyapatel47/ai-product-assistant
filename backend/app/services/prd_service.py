import os
import json

from dotenv import load_dotenv
from google import genai


load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_prd(analysis):

    prompt = f"""
You are an expert Product Manager.

Based on the following customer feedback analysis, create a complete
and practical Product Requirements Document (PRD).

Customer Feedback Analysis:
{json.dumps(analysis, default=str, indent=2)}

Return ONLY valid JSON with exactly this structure:

{{
    "title": "...",
    "problem_statement": "...",
    "objective": "...",

    "target_users": [
        "..."
    ],

    "user_stories": [
        {{
            "story": "As a user, I want ... so that ..."
        }}
    ],

    "functional_requirements": [
        "..."
    ],

    "non_functional_requirements": [
        "..."
    ],

    "acceptance_criteria": [
        "..."
    ],

    "success_metrics": [
        "..."
    ],

    "priority": "High/Medium/Low"
}}

Rules:
- Keep the PRD concise.
- Maximum 5 user stories.
- Maximum 5 functional requirements.
- Maximum 5 acceptance criteria.
- Return only valid JSON.
- Do not use markdown.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        response_text = response.text.strip()

        # Remove markdown if present
        if response_text.startswith("```json"):
            response_text = response_text.replace(
                "```json", ""
            ).replace("```", "").strip()

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
            f"Gemini PRD generation error: {str(e)}"
        )