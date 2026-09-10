from app.services.trend_analysis import analyze_trends


print("===== TREND ANALYSIS EDGE CASE TESTS =====")


# --------------------------------------------------
# TEST 1: Empty input
# --------------------------------------------------

result = analyze_trends([])

print("\nTest 1: Empty input")
print("Result:", result)

assert result == []
print("PASS")


# --------------------------------------------------
# TEST 2: Missing date
# --------------------------------------------------

feature_requests = [
    {
        "feature": "Dark Mode",
        "date": None
    }
]

result = analyze_trends(feature_requests)

print("\nTest 2: Missing date")
print("Result:", result)

assert result == []
print("PASS")


# --------------------------------------------------
# TEST 3: Invalid date
# --------------------------------------------------

feature_requests = [
    {
        "feature": "Dark Mode",
        "date": "not-a-date"
    }
]

result = analyze_trends(feature_requests)

print("\nTest 3: Invalid date")
print("Result:", result)

assert result == []
print("PASS")


# --------------------------------------------------
# TEST 4: Only one request
# --------------------------------------------------

feature_requests = [
    {
        "feature": "Dark Mode",
        "date": "2026-06-10"
    }
]

result = analyze_trends(feature_requests)

print("\nTest 4: Single request")
print("Result:", result)

assert result[0]["total_requests"] == 1
assert result[0]["trend"] == "stable"

print("PASS")


# --------------------------------------------------
# TEST 5: Multiple requests in same month
# --------------------------------------------------

feature_requests = [
    {
        "feature": "Dark Mode",
        "date": "2026-06-01"
    },
    {
        "feature": "Dark Mode",
        "date": "2026-06-05"
    },
    {
        "feature": "Dark Mode",
        "date": "2026-06-20"
    }
]

result = analyze_trends(feature_requests)

print("\nTest 5: Multiple requests in same month")
print("Result:", result)

assert result[0]["total_requests"] == 3
assert result[0]["monthly_counts"]["2026-06"] == 3
assert result[0]["trend"] == "stable"

print("PASS")


# --------------------------------------------------
# TEST 6: Different months
# --------------------------------------------------

feature_requests = [
    {
        "feature": "Dark Mode",
        "date": "2026-06-10"
    },
    {
        "feature": "Dark Mode",
        "date": "2026-07-10"
    },
    {
        "feature": "Dark Mode",
        "date": "2026-08-10"
    }
]

result = analyze_trends(feature_requests)

print("\nTest 6: Multiple months")
print("Result:", result)

assert result[0]["monthly_counts"] == {
    "2026-06": 1,
    "2026-07": 1,
    "2026-08": 1
}

assert result[0]["trend"] == "stable"

print("PASS")


print("\n===================================")
print("ALL EDGE CASE TESTS PASSED ✅")
print("===================================")