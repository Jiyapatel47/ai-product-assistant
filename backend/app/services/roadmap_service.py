import os
import json

from dotenv import load_dotenv
from google import genai


load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_roadmap(prd, analysis):

    prompt = f"""
You are an expert Product Manager.

Create a practical product development roadmap based on the PRD and AI analysis below.

PRD:
{json.dumps(prd, default=str)}

Analysis:
{json.dumps(analysis, default=str)}

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
- Keep tasks practical and actionable.
- Use realistic timelines.
- Keep the roadmap concise.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return json.loads(response.text)