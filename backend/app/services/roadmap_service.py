import os
import json

from dotenv import load_dotenv
from google import genai


load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# ==========================================
# AI Roadmap Generation
# ==========================================

def generate_roadmap(prd, analysis):

    prompt = f"""
You are an expert Product Manager.

Create a practical product development roadmap based on the PRD
and AI customer feedback analysis below.

PRD:
{json.dumps(prd, default=str, indent=2)}

Analysis:
{json.dumps(analysis, default=str, indent=2)}

Return ONLY valid JSON with exactly this structure:

{{
    "title": "Product Development Roadmap",

    "overview": "Short roadmap overview",

    "phases": [
        {{
            "phase": "Phase 1",
            "title": "Critical Fixes",
            "timeline": "Week 1-2",
            "priority": "High",

            "goals": [
                "Goal 1",
                "Goal 2"
            ],

            "tasks": [
                "Task 1",
                "Task 2"
            ]
        }}
    ]
}}

Rules:
- Create 3 to 4 logical phases.
- Prioritize critical customer problems first.
- Phase 1 should focus on critical and high-impact issues.
- Later phases should focus on improvements and optimizations.
- Keep tasks practical and actionable.
- Use realistic timelines.
- Keep the roadmap concise.
- Return only valid JSON.
- Do not use markdown.
- Do not include ```json.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        response_text = response.text.strip()

        # Remove markdown code block if Gemini returns it
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
            f"Gemini roadmap generation error: {str(e)}"
        )