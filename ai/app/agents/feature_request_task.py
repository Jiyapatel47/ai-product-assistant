from crewai import Task

from app.agents.feature_request_agent import feature_request_agent


feature_request_task = Task(
    description=(
        "Analyze the following customer feedback and identify "
        "feature requests and product improvement requests:\n\n"
        "{feedback}\n\n"

        "For each feature request:\n"
        "1. Identify the requested feature.\n"
        "2. Write a clear description of what the user wants.\n"
        "3. Normalize the feature name to the underlying product capability. "
        "Different wording that represents the same capability must use "
        "the same normalized feature name.\n\n"

        "For example, requests such as 'dark mode', 'dark theme', "
        "and 'night mode' should be normalized to the same underlying "
        "feature, such as 'Dark Mode'.\n\n"

        "Do not treat complaints or existing product problems as "
        "feature requests."
    ),

    expected_output=(
    "Return ONLY valid JSON in the following format:\n"
    "{\n"
    '  "feature_requests": [\n'
    "    {\n"
    '      "feature": "Normalized feature name",\n'
    '      "description": "Clear explanation of what users want",\n'
    '      "request_count": 3,\n'
    '      "original_requests": [\n'
    '        "Original customer request 1",\n'
    '        "Original customer request 2"\n'
    "      ]\n"
    "    }\n"
    "  ]\n"
    "}\n\n"

    "The feature field must represent the underlying product "
    "capability, not merely repeat one user's wording.\n"

    "request_count must equal the number of items in "
    "original_requests.\n"

    "Every original request belonging to a normalized feature "
    "must be preserved in original_requests.\n"

    "Do not include Markdown, explanations, or text outside the JSON."
   ),
    agent=feature_request_agent
)