from app.services.trend_analysis import build_trend_analysis


feature_requests = [
    {
        "feature": "Dark Mode",
        "date": "2026-06-05"
    },
    {
        "feature": "Dark Mode",
        "date": "2026-07-05"
    },
    {
        "feature": "Dark Mode",
        "date": "2026-07-15"
    },
    {
        "feature": "Dark Mode",
        "date": "2026-08-05"
    },
    {
        "feature": "Dark Mode",
        "date": "2026-08-15"
    },
    {
        "feature": "Dark Mode",
        "date": "2026-08-20"
    },

    {
        "feature": "PDF Export",
        "date": "2026-06-10"
    },
    {
        "feature": "PDF Export",
        "date": "2026-06-15"
    },
    {
        "feature": "PDF Export",
        "date": "2026-07-10"
    },
    {
        "feature": "PDF Export",
        "date": "2026-08-10"
    },

    {
        "feature": "Google Login",
        "date": "2026-06-08"
    },
    {
        "feature": "Google Login",
        "date": "2026-06-18"
    },
    {
        "feature": "Google Login",
        "date": "2026-07-08"
    },
    {
        "feature": "Google Login",
        "date": "2026-07-18"
    },
    {
        "feature": "Google Login",
        "date": "2026-08-08"
    },
    {
        "feature": "Google Login",
        "date": "2026-08-18"
    }
]


result = build_trend_analysis(feature_requests)


print("===== FINAL TREND ANALYSIS OUTPUT =====")

print("Total Requests:", result["total_requests"])

for feature in result["features"]:
    print(f"\nFeature: {feature['feature']}")
    print("Total Requests:", feature["total_requests"])
    print("Monthly Counts:", feature["monthly_counts"])
    print("Trend:", feature["trend"])


# Validation
assert result["total_requests"] == 16

assert len(result["features"]) == 3

dark_mode = next(
    item for item in result["features"]
    if item["feature"] == "Dark Mode"
)

assert dark_mode["total_requests"] == 6
assert dark_mode["trend"] == "increasing"

pdf_export = next(
    item for item in result["features"]
    if item["feature"] == "PDF Export"
)

assert pdf_export["total_requests"] == 4
assert pdf_export["trend"] == "decreasing"

google_login = next(
    item for item in result["features"]
    if item["feature"] == "Google Login"
)

assert google_login["total_requests"] == 6
assert google_login["trend"] == "stable"


print("\n===================================")
print("FINAL OUTPUT TEST PASSED ✅")
print("===================================")