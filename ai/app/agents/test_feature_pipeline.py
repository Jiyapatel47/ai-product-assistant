import crewai.llms.cache as crewai_cache

crewai_cache.mark_cache_breakpoint = lambda message: message

from crewai import Crew
import json

from app.agents.feature_request_agent import feature_request_agent
from app.agents.feature_request_task import feature_request_task
from app.services.feature_clustering import cluster_feature_requests


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


# Step 1: Extract and normalize feature requests
result = crew.kickoff(
    inputs={
        "feedback": feedback
    }
)


print("\n===== NORMALIZED FEATURE REQUESTS =====")

feature_data = json.loads(str(result))

for item in feature_data["feature_requests"]:
    print(f"- {item['feature']}: {item['description']}")


# Step 2: Cluster normalized feature requests
clusters = cluster_feature_requests(
    feature_data["feature_requests"]
)


print("\n===== FINAL FEATURE CLUSTERS =====")

for index, cluster in enumerate(clusters, start=1):

    print(f"\nCluster {index}:")
    print(f"Feature: {cluster['feature']}")
    print(f"Request Count: {cluster['request_count']}")

    print("Original Requests:")

    for request in cluster["original_requests"]:
        print(f"- {request}")