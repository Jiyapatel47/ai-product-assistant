from sentiment import analyze_sentiment


feedback = [
    "I love this application!",
    "The application crashes constantly.",
    "The application has a dashboard."
]


for text in feedback:

    result = analyze_sentiment(text)

    print("\nFeedback:", text)
    print("Sentiment:", result["sentiment"])
    print("Confidence:", result["score"])