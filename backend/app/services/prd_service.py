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

Based on the following customer feedback analysis, create a Product Requirements Document (PRD).

Analysis:
{json.dumps(analysis, default=str)}

Return ONLY valid JSON with this exact structure:

{{
    "title": "PRD title",
    "problem_statement": "Brief problem statement",
    "objective": "Main product objective",

    "user_stories": [
        {{
            "story": "As a user, I want..."
        }}
    ],

    "functional_requirements": [
        "Requirement 1",
        "Requirement 2"
    ],

    "non_functional_requirements": [
        "Performance requirement",
        "Security requirement"
    ],

    "acceptance_criteria": [
        "Criteria 1",
        "Criteria 2"
    ],

    "success_metrics": [
        "Metric 1",
        "Metric 2"
    ]
}}

Keep the PRD concise, practical, and actionable.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return json.loads(response.text)