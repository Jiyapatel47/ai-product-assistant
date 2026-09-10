from app.schemas.analysis import Theme


theme_data = {
    "theme": "Checkout performance and stability",
    "description": (
        "Issues related to crashes, slow load times, "
        "and payment failures during checkout."
    )
}


theme = Theme(**theme_data)


print("Theme schema validation successful!")
print(theme)