from transformers import pipeline


MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"


sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model=MODEL_NAME
)


def analyze_sentiment(text: str) -> dict:
    """
    Analyze the sentiment of a feedback message.
    """

    result = sentiment_pipeline(text)[0]

    return {
        "sentiment": result["label"].lower(),
        "score": result["score"]
    }