from crewai import Task

from app.agents.theme_agent import theme_agent


theme_task = Task(
    description="""
Analyze the customer feedback below and identify the main recurring themes.

Customer feedback:
{feedback}

Return ONLY valid JSON.

Use exactly this structure:

{
    "themes": [
        {
            "theme": "Short standardized theme name",
            "description": "Concise explanation of the theme",
            "feedback_count": 0,
            "supporting_feedback": [
                "Short representative feedback"
            ]
        }
    ]
}

Rules:

1. Identify meaningful recurring themes.
2. Keep theme names short and standardized.
3. Do not create a separate theme for every feedback item.
4. Group similar feedback under the same theme.
5. A feature request alone should not automatically become a theme.
6. Keep the description concise.
7. Maximum 8 themes.
8. Include at most 3 representative supporting feedback items per theme.
9. Keep supporting feedback concise. Preserve the original meaning.
10. feedback_count must represent the number of feedback items belonging to that theme.
11. Do not invent feedback.
12. Return ONLY valid JSON.
13. Do not use markdown or ``` fences.
""",
    expected_output="""
A valid JSON object containing a "themes" array.
""",
    agent=theme_agent
)