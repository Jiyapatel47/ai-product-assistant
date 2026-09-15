from preprocessing import preprocess_feedback


feedback = [
    {
        "content": "   App crashes     frequently!!!   ",
        "source": "customer review"
    },
    {
        "content": "Please    add dark mode",
        "source": "feature request"
    },
    {
        "content": "     ",
        "source": "customer review"
    }
]


result = preprocess_feedback(feedback)

print("Preprocessed Feedback:")
print(result)