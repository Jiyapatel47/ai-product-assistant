from app.services.trend_analysis import analyze_trends


feature_requests = [
    # Dark Mode: increasing
    {"feature": "Dark Mode", "date": "2026-06-05"},
    {"feature": "Dark Mode", "date": "2026-06-15"},
    {"feature": "Dark Mode", "date": "2026-07-05"},
    {"feature": "Dark Mode", "date": "2026-07-12"},
    {"feature": "Dark Mode", "date": "2026-07-20"},

    # PDF Export: decreasing
    {"feature": "PDF Export", "date": "2026-06-10"},
    {"feature": "PDF Export", "date": "2026-06-18"},
    {"feature": "PDF Export", "date": "2026-07-10"},

    # Google Login: stable
    {"feature": "Google Login", "date": "2026-06-08"},
    {"feature": "Google Login", "date": "2026-07-08"},

    # No date: should be ignored
    {"feature": "Dark Mode"},
]


results = analyze_trends(feature_requests)


print("\n===== TREND ANALYSIS RESULTS =====")

for result in results:
    print(f"\nFeature: {result['feature']}")
    print(f"Total Requests: {result['total_requests']}")
    print(f"Monthly Counts: {result['monthly_counts']}")
    print(f"Trend: {result['trend']}")