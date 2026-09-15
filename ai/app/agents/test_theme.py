import crewai.llms.cache as crewai_cache

crewai_cache.mark_cache_breakpoint = lambda message: message

from crewai import Crew
import json

from app.agents.theme_agent import theme_agent
from app.agents.theme_task import theme_task
from app.schemas.analysis import Theme


crew = Crew(
    agents=[theme_agent],
    tasks=[theme_task],
    verbose=True
)


feedback = """

The application crashes whenever I try to checkout.

The checkout page is extremely slow.

Payment fails frequently during checkout.

Please add dark mode to the application.

The interface is difficult to navigate.

Users are asking for better navigation.

The application takes too long to load.

"""


result = crew.kickoff(
    inputs={
        "feedback": feedback
    }
)


print("\n===== THEME RESULT =====")

print(result)


# Convert agent output to JSON
theme_data = json.loads(str(result))


# Validate each theme using Pydantic
validated_themes = []

for item in theme_data["themes"]:

    theme = Theme(**item)

    validated_themes.append(theme)


print("\n===== VALIDATED THEMES =====")

for theme in validated_themes:

    print(f"Theme: {theme.theme}")
    print(f"Description: {theme.description}")
    print(f"Feedback Count: {theme.feedback_count}")

    print("Supporting Feedback:")

    for feedback_item in theme.supporting_feedback:
        print(f"- {feedback_item}")

    print()