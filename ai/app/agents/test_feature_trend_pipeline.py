import json
import crewai.llms.cache as crewai_cache

# Temporary compatibility workaround for CrewAI + Groq
crewai_cache.mark_cache_breakpoint = lambda message: message

from crewai import Crew

from app.agents.feature_request_agent import feature_request_agent
from app.agents.feature_request_task import feature_request_task
from app.services.trend_analysis import (
    attach_dates_to_features,
    analyze_trends
)


# -----------------------------
# CrewAI Feature Request Agent
# -----------------------------

crew = Crew(
    agents=[feature_request_agent],
    tasks=[feature_request_task],
    verbose=True
)


# -----------------------------
# Feedback with REAL dates
# -----------------------------

feedback = [
    # Dark Mode → Increasing
    {
        "content": "Please add dark mode to the application.",
        "source": "customer review",
        "date": "2026-06-05"
    },
    {
        "content": "I want a dark theme for the application.",
        "source": "customer review",
        "date": "2026-07-05"
    },
    {
        "content": "Please provide a night mode for users.",
        "source": "feature request",
        "date": "2026-07-15"
    },
    {
        "content": "The app should support dark mode.",
        "source": "feature request",
        "date": "2026-08-05"
    },
    {
        "content": "Please add dark theme support.",
        "source": "feature request",
        "date": "2026-08-15"
    },
    {
        "content": "Night mode would be very useful.",
        "source": "feature request",
        "date": "2026-08-20"
    },

    # PDF Export → Decreasing
    {
        "content": "Users want the ability to export reports as PDF.",
        "source": "feature request",
        "date": "2026-06-10"
    },
    {
        "content": "Please allow reports to be downloaded as PDF.",
        "source": "feature request",
        "date": "2026-06-15"
    },
    {
        "content": "PDF export would be useful.",
        "source": "feature request",
        "date": "2026-07-10"
    },
    {
        "content": "Please add PDF download.",
        "source": "feature request",
        "date": "2026-08-10"
    },

    # Google Login → Stable
    {
        "content": "Please add Google login.",
        "source": "feature request",
        "date": "2026-06-08"
    },
    {
        "content": "I want to sign in using my Google account.",
        "source": "feature request",
        "date": "2026-06-18"
    },
    {
        "content": "Google authentication would be useful.",
        "source": "feature request",
        "date": "2026-07-08"
    },
    {
        "content": "Please support Google sign in.",
        "source": "feature request",
        "date": "2026-07-18"
    },
    {
        "content": "Add Google account authentication.",
        "source": "feature request",
        "date": "2026-08-08"
    },
    {
        "content": "I would like Google login.",
        "source": "feature request",
        "date": "2026-08-18"
    },

    # Non-feature feedback
    {
        "content": "The application crashes whenever I try to checkout.",
        "source": "customer complaint",
        "date": "2026-08-12"
    }
]


# Convert feedback into the format expected by the LLM
feedback_text = "\n".join(
    item["content"]
    for item in feedback
)


# -----------------------------
# Run Feature Request Agent
# -----------------------------

result = crew.kickoff(
    inputs={
        "feedback": feedback_text
    }
)


feature_data = json.loads(str(result))


print("\n===== FEATURE REQUEST ANALYSIS =====")

for item in feature_data["feature_requests"]:
    print(f"\nFeature: {item['feature']}")
    print(f"Request Count: {item['request_count']}")

    for request in item["original_requests"]:
        print(f"- {request}")


# -----------------------------
# Attach dates
# -----------------------------

enriched_features = attach_dates_to_features(
    feature_data["feature_requests"],
    feedback
)


print("\n===== DATE-ENRICHED FEATURES =====")

for feature in enriched_features:

    print(f"\nFeature: {feature['feature']}")

    for request in feature["original_requests"]:
        print(
            f"- {request['text']} "
            f"→ {request['date']}"
        )


# -----------------------------
# Prepare data for trend analysis
# -----------------------------

trend_input = []

for feature in enriched_features:

    for request in feature["original_requests"]:

        if request["date"]:

            trend_input.append({
                "feature": feature["feature"],
                "date": request["date"]
            })


# -----------------------------
# Analyze Trends
# -----------------------------

trend_results = analyze_trends(trend_input)


print("\n===== TREND ANALYSIS =====")

for result in trend_results:

    print(f"\nFeature: {result['feature']}")
    print(f"Total Requests: {result['total_requests']}")
    print(f"Monthly Counts: {result['monthly_counts']}")
    print(f"Trend: {result['trend']}")