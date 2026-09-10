import crewai.llms.cache as crewai_cache

crewai_cache.mark_cache_breakpoint = lambda message: message

from crewai import Crew
import json

from app.agents.feature_request_agent import feature_request_agent
from app.agents.feature_request_task import feature_request_task
from app.schemas.analysis import FeatureRequest


crew = Crew(
    agents=[feature_request_agent],
    tasks=[feature_request_task],
    verbose=True
)


feedback = """

Please add dark mode to the application.

I want a dark theme for the application.

Please provide a night mode for users.

Users want the ability to export reports as PDF.

Please allow reports to be downloaded as PDF.

Please add Google login.

I want to sign in using my Google account.

The application crashes whenever I try to checkout.

The checkout page is extremely slow.

"""


result = crew.kickoff(
    inputs={
        "feedback": feedback
    }
)


print("\n===== FEATURE REQUEST RESULT =====")

print(result)


# Convert agent output to JSON
feature_data = json.loads(str(result))


# Validate each feature request using Pydantic
validated_features = []

for item in feature_data["feature_requests"]:

    feature = FeatureRequest(**item)

    validated_features.append(feature)


print("\n===== VALIDATED FEATURE REQUESTS =====")

for feature in validated_features:

    print(f"Feature: {feature.feature}")
    print(f"Description: {feature.description}")
    print(f"Request Count: {feature.request_count}")

    print("Original Requests:")

    for request in feature.original_requests:
        print(f"- {request}")

    print()