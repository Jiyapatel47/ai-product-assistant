from crewai import Task

from app.agents.pain_point_agent import pain_point_agent


pain_point_task = Task(
    description=(
        "Analyze the following customer feedback and identify "
        "the main pain points experienced by users:\n\n"
        "{feedback}\n\n"
        "Focus on actual problems, complaints, difficulties, "
        "or negative experiences. "
        "Do not treat feature requests as pain points."
    ),

    expected_output=(
        "Return ONLY valid JSON in the following format:\n"
        "{\n"
        '  "pain_points": [\n'
        "    {\n"
        '      "title": "Short pain point title",\n'
        '      "description": "Clear explanation of the problem"\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Do not include Markdown, explanations, or text outside the JSON."
    ),

    agent=pain_point_agent
)