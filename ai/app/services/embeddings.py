from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"


embedding_model = SentenceTransformer(MODEL_NAME)


def create_embedding(text: str) -> list[float]:
    """
    Convert text into a numerical embedding.
    """

    embedding = embedding_model.encode(text)

    return embedding.tolist()