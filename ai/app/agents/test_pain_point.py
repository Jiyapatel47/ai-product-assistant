import crewai.llms.cache as crewai_cache

crewai_cache.mark_cache_breakpoint = lambda message: message

from crewai import Crew
import json

from app.agents.pain_point_agent import pain_point_agent
from app.agents.pain_point_task import pain_point_task
from app.schemas.analysis import PainPoint


crew = Crew(
    agents=[pain_point_agent],
    tasks=[pain_point_task],
    verbose=True
)


feedback = """

The application crashes whenever I try to checkout.

The checkout page is extremely slow.

"""


result = crew.kickoff(
    inputs={
        "feedback": feedback
    }
)


print("\n===== PAIN POINT RESULT =====")

print(result)


# Convert agent output to JSON
pain_point_data = json.loads(str(result))


# Validate each pain point using Pydantic
validated_pain_points = []

for item in pain_point_data["pain_points"]:

    pain_point = PainPoint(**item)

    validated_pain_points.append(pain_point)


print("\n===== VALIDATED PAIN POINTS =====")

for pain_point in validated_pain_points:

    print(f"Title: {pain_point.title}")
    print(f"Description: {pain_point.description}")
    print()