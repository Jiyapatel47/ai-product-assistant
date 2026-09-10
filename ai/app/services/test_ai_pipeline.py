from app.services.ai_pipeline import analyze_feedback


feedback = [
    {
        "content": "   App crashes frequently!!!   ",
        "source": "customer review",
        "date": "2026-08-10"
    },
    {
        "content": "The checkout page is very slow.",
        "source": "customer review",
        "date": "2026-08-11"
    },
    {
        "content": "Please add dark mode",
        "source": "feature request",
        "date": "2026-08-12"
    },
    {
        "content": "Payment fails when I try to checkout.",
        "source": "customer complaint",
        "date": "2026-08-13"
    }
]


result = analyze_feedback(feedback)


print("===== AI PIPELINE TEST =====")
print(result)


assert len(result["cleaned_feedback"]) == 4

# Sentiment checks
assert result["cleaned_feedback"][0]["sentiment"] == "negative"
assert result["cleaned_feedback"][1]["sentiment"] == "negative"
assert "sentiment_score" in result["cleaned_feedback"][0]

# Date preservation
assert result["cleaned_feedback"][0]["date"] == "2026-08-10"

# Theme checks
assert "themes" in result
assert isinstance(result["themes"], list)
assert len(result["themes"]) > 0

for theme in result["themes"]:
    assert "theme" in theme
    assert "description" in theme
    assert "feedback_count" in theme
    assert "supporting_feedback" in theme

# Pain point checks
assert "pain_points" in result
assert isinstance(result["pain_points"], list)
assert len(result["pain_points"]) > 0

for pain_point in result["pain_points"]:
    assert "title" in pain_point
    assert "description" in pain_point

# Feature request checks
assert "feature_requests" in result
assert isinstance(result["feature_requests"], list)
assert len(result["feature_requests"]) > 0

for feature in result["feature_requests"]:
    assert "feature" in feature
    assert "description" in feature
    assert "request_count" in feature
    assert "original_requests" in feature

# Feature clustering checks
assert "feature_clusters" in result
assert isinstance(result["feature_clusters"], list)

for cluster in result["feature_clusters"]:
    assert "feature" in cluster
    assert "request_count" in cluster
    assert "original_requests" in cluster

print("\n===== FEATURE CLUSTERS =====")

for index, cluster in enumerate(result["feature_clusters"], start=1):
    print(f"\nCluster {index}:")
    print(f"Feature: {cluster['feature']}")
    print(f"Request Count: {cluster['request_count']}")
    print("Original Requests:")

    for request in cluster["original_requests"]:
        print(f"- {request}")

# Trend Analysis checks
assert "trend_analysis" in result
assert isinstance(result["trend_analysis"], dict)

assert "total_requests" in result["trend_analysis"]
assert "features" in result["trend_analysis"]

assert result["trend_analysis"]["total_requests"] > 0

for trend in result["trend_analysis"]["features"]:
    assert "feature" in trend
    assert "total_requests" in trend
    assert "monthly_counts" in trend
    assert "trend" in trend

print("\n===== TREND ANALYSIS =====")

for trend in result["trend_analysis"]["features"]:
    print(f"\nFeature: {trend['feature']}")
    print(f"Total Requests: {trend['total_requests']}")
    print(f"Monthly Counts: {trend['monthly_counts']}")
    print(f"Trend: {trend['trend']}")


print(
    "\nPIPELINE PREPROCESSING + SENTIMENT + "
    "THEME + PAIN POINT + FEATURE REQUEST + "
    "CLUSTERING + TREND ANALYSIS TEST PASSED ✅"
)




