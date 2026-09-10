from collections import defaultdict
from datetime import datetime


def parse_date(date_value):
    """
    Convert a date value into a datetime object.
    Supports common ISO date formats.
    """

    if not date_value:
        return None

    if isinstance(date_value, datetime):
        return date_value

    date_string = str(date_value).strip()

    try:
        return datetime.fromisoformat(
            date_string.replace("Z", "+00:00")
        )
    except ValueError:
        return None


def get_month(date):
    """Return month label in YYYY-MM format."""
    return date.strftime("%Y-%m")


def attach_dates_to_features(
    feature_requests: list[dict],
    feedback: list[dict]
) -> list[dict]:
    """
    Attach original feedback dates to normalized feature requests.

    feature_requests:
    [
        {
            "feature": "Dark Mode",
            "description": "...",
            "request_count": 2,
            "original_requests": [
                "Please add dark mode.",
                "I want a dark theme."
            ]
        }
    ]

    feedback:
    [
        {
            "content": "Please add dark mode.",
            "source": "customer review",
            "date": "2026-06-10"
        }
    ]
    """

    # Map feedback content to its date(s)
    feedback_dates = defaultdict(list)

    for item in feedback:
        content = item.get("content", "").strip()
        date = item.get("date")

        if content and date:
            feedback_dates[content].append(date)

    enriched_features = []

    for feature in feature_requests:

        enriched_requests = []

        for request in feature.get("original_requests", []):

            request_text = request.strip()

            dates = feedback_dates.get(request_text, [])

            if dates:
                for date in dates:
                    enriched_requests.append({
                        "text": request_text,
                        "date": date
                    })
            else:
                # Keep the request even if no date is available
                enriched_requests.append({
                    "text": request_text,
                    "date": None
                })

        enriched_feature = {
            "feature": feature.get("feature", ""),
            "description": feature.get("description", ""),
            "request_count": feature.get("request_count", 0),
            "original_requests": enriched_requests
        }

        enriched_features.append(enriched_feature)

    return enriched_features


def analyze_trends(feature_requests: list[dict]) -> list[dict]:
    """
    Analyze feature request trends over time.

    Expected input:

    [
        {
            "feature": "Dark Mode",
            "date": "2026-08-01"
        }
    ]

    Returns:

    [
        {
            "feature": "Dark Mode",
            "total_requests": 1,
            "monthly_counts": {
                "2026-08": 1
            },
            "trend": "stable"
        }
    ]
    """

    if not feature_requests:
        return []

    feature_data = defaultdict(list)

    for item in feature_requests:
     feature = item.get("feature", "").strip()

     if not feature:
         continue

     for request in item.get("original_requests", []):
        if not isinstance(request, dict):
            continue

        date = parse_date(request.get("date"))

        if date:
            feature_data[feature].append(date)

    results = []

    for feature, dates in feature_data.items():

        monthly_counts = defaultdict(int)

        for date in dates:
            month = get_month(date)
            monthly_counts[month] += 1

        sorted_months = sorted(monthly_counts)

        counts = [
            monthly_counts[month]
            for month in sorted_months
        ]

        if len(counts) < 2:
            trend = "stable"

        else:
            midpoint = len(counts) // 2

            first_half = counts[:midpoint]
            second_half = counts[midpoint:]

            first_average = sum(first_half) / len(first_half)
            second_average = sum(second_half) / len(second_half)

            if second_average > first_average:
                trend = "increasing"

            elif second_average < first_average:
                trend = "decreasing"

            else:
                trend = "stable"

        results.append({
            "feature": feature,
            "total_requests": len(dates),
            "monthly_counts": dict(monthly_counts),
            "trend": trend
        })

    return results

def build_trend_analysis(feature_requests: list[dict]) -> dict:
    """
    Build the final structured trend analysis result.
    """

    trends = analyze_trends(feature_requests)

    total_requests = sum(
        item["total_requests"]
        for item in trends
    )

    return {
        "total_requests": total_requests,
        "features": trends
    }