from crewai import Task

from app.agents.theme_agent import theme_agent


theme_task = Task(
    description=(
        "Analyze the following customer feedback and identify "
        "the main themes and recurring topics:\n\n"
        "{feedback}\n\n"

        "For each theme:\n"
        "1. Identify the broader topic or recurring customer concern.\n"
        "2. Give the theme a short, clear, standardized category name.\n"
        "3. Write a clear description of the theme.\n"
        "4. Count how many original customer feedback items support "
        "this theme.\n"
        "5. Preserve every original feedback item that supports "
        "the theme in supporting_feedback.\n\n"

        "Theme names should be concise category names, usually "
        "2 to 5 words. Examples include:\n"
        "- User Interface & Navigation\n"
        "- Application Performance\n"
        "- Checkout Experience\n"
        "- Payment Issues\n"
        "- Account Management\n"
        "- Security & Privacy\n\n"

        "Do not create long sentence-like theme names.\n"
        "Do not simply repeat the wording of an individual feedback item.\n\n"

        "A theme should represent a broader customer topic or recurring "
        "concern, not an individual feature request.\n\n"

        "Do NOT create a theme whose sole purpose is to represent a "
        "requested feature, such as dark mode, PDF export, Google login, "
        "or any other new functionality.\n\n"

        "If feedback contains a feature request, focus on the broader "
        "customer concern or topic surrounding that request, if one exists. "
        "Otherwise, do not include that feedback as a separate theme.\n\n"

        "Related feedback should belong to the same theme when they "
        "describe the same broader topic."
    ),

    expected_output=(
        "Return ONLY valid JSON in the following format:\n"
        "{\n"
        '  "themes": [\n'
        "    {\n"
        '      "theme": "Theme name",\n'
        '      "description": "Short explanation of the theme",\n'
        '      "feedback_count": 3,\n'
        '      "supporting_feedback": [\n'
        '        "Original feedback item 1",\n'
        '        "Original feedback item 2",\n'
        '        "Original feedback item 3"\n'
        "      ]\n"
        "    }\n"
        "  ]\n"
        "}\n\n"

        "The theme field must be a short, standardized category name "
        "representing the broader topic.\n"

        "feedback_count must equal the number of items in "
        "supporting_feedback.\n"

        "Every feedback item supporting a theme must be preserved "
        "in supporting_feedback.\n"

        "Do not include Markdown, explanations, or text outside the JSON."
    ),

    agent=theme_agent
)