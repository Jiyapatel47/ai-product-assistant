import re


def clean_text(text: str) -> str:
    text = str(text).strip()
    text = re.sub(r"\s+", " ", text)
    return text


def preprocess_feedback(feedback: list[dict]) -> list[dict]:
    processed_feedback = []

    for item in feedback:
        content = item.get("content", "")
        source = item.get("source", "")
        date = item.get("date")

        cleaned_content = clean_text(content)

        if not cleaned_content:
            continue

        processed_item = {
            "content": cleaned_content,
            "source": source
        }

        # Preserve date when it is available
        if date:
            processed_item["date"] = date

        processed_feedback.append(processed_item)

    return processed_feedback