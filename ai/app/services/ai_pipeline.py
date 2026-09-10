import json

import crewai.llms.cache as crewai_cache


# Temporary compatibility workaround for CrewAI + Groq
crewai_cache.mark_cache_breakpoint = lambda message: message

from crewai import Crew

from app.services.preprocessing import preprocess_feedback
from app.services.sentiment import analyze_sentiment

from app.agents.theme_agent import theme_agent
from app.agents.theme_task import theme_task

from app.agents.pain_point_agent import pain_point_agent
from app.agents.pain_point_task import pain_point_task

from app.agents.feature_request_agent import feature_request_agent
from app.agents.feature_request_task import feature_request_task

from app.services.feature_clustering import cluster_feature_requests

from app.services.trend_analysis import (
    attach_dates_to_features,
    build_trend_analysis
)


def analyze_feedback(feedback: list[dict]) -> dict:
    """
    Run the complete AI feedback analysis pipeline.
    """

    # --------------------------------------------------
    # Step 1: Preprocess feedback
    # --------------------------------------------------

    cleaned_feedback = preprocess_feedback(feedback)

    # --------------------------------------------------
    # Step 2: Sentiment analysis
    # --------------------------------------------------

    for item in cleaned_feedback:
        sentiment_result = analyze_sentiment(item["content"])

        item["sentiment"] = sentiment_result["sentiment"]
        item["sentiment_score"] = sentiment_result["score"]

    # --------------------------------------------------
    # Prepare feedback text for CrewAI agents
    # --------------------------------------------------

    feedback_text = "\n".join(
        item["content"]
        for item in cleaned_feedback
    )

    # --------------------------------------------------
    # Step 3: Theme Analysis
    # --------------------------------------------------

    theme_crew = Crew(
        agents=[theme_agent],
        tasks=[theme_task],
        verbose=True
    )

    theme_result = theme_crew.kickoff(
        inputs={
            "feedback": feedback_text
        }
    )

    themes = json.loads(str(theme_result))

    # --------------------------------------------------
    # Step 4: Pain Point Analysis
    # --------------------------------------------------

    pain_point_crew = Crew(
        agents=[pain_point_agent],
        tasks=[pain_point_task],
        verbose=True
    )

    pain_point_result = pain_point_crew.kickoff(
        inputs={
            "feedback": feedback_text
        }
    )

    pain_points = json.loads(str(pain_point_result))

    # --------------------------------------------------
    # Step 5: Feature Request Analysis
    # --------------------------------------------------

    feature_crew = Crew(
        agents=[feature_request_agent],
        tasks=[feature_request_task],
        verbose=True
    )

    feature_result = feature_crew.kickoff(
        inputs={
            "feedback": feedback_text
        }
    )

    feature_requests = json.loads(str(feature_result))

    # Step 6: Feature Request Clustering
    feature_clusters = cluster_feature_requests(
       feature_requests["feature_requests"]
    )
    # Step 7: Attach dates to feature requests
    dated_feature_requests = attach_dates_to_features(
     feature_requests["feature_requests"],
     cleaned_feedback
    )
    # Step 8: Trend Analysis
    trend_analysis = build_trend_analysis(
     dated_feature_requests
    )

    # --------------------------------------------------
    # Final result
    # --------------------------------------------------

    return {
    "cleaned_feedback": cleaned_feedback,
    "themes": themes["themes"],
    "pain_points": pain_points["pain_points"],
    "feature_requests": feature_requests["feature_requests"],
    "feature_clusters": feature_clusters,
    "trend_analysis": trend_analysis
}