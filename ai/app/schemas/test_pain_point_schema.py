from app.schemas.analysis import PainPoint


pain_point_data = {
    "title": "Application crashes during checkout",
    "description": (
        "The app crashes whenever the user attempts to complete "
        "a purchase, preventing the checkout process from finishing."
    )
}


pain_point = PainPoint(**pain_point_data)


print("Pain Point schema validation successful!")
print(pain_point)