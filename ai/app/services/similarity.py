from sklearn.metrics.pairwise import cosine_similarity

from embeddings import create_embedding


def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculate semantic similarity between two texts.
    """

    embedding1 = create_embedding(text1)
    embedding2 = create_embedding(text2)

    similarity = cosine_similarity(
        [embedding1],
        [embedding2]
    )[0][0]

    return float(similarity)