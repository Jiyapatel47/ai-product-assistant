from sklearn.metrics.pairwise import cosine_similarity

from app.services.embeddings import create_embedding


SIMILARITY_THRESHOLD = 0.70


def cluster_feature_requests(
    feature_requests: list[dict]
) -> list[dict]:
    """
    Group semantically similar feature requests.

    Each feature request has:
    - feature
    - description
    - request_count
    - original_requests

    Returns structured clusters containing:
    - feature
    - request_count
    - original_requests
    """

    if not feature_requests:
        return []

    embeddings = [
        create_embedding(
            item["feature"] + " " + item["description"]
        )
        for item in feature_requests
    ]

    clusters = []
    used = set()

    for i in range(len(feature_requests)):

        if i in used:
            continue

        cluster = [feature_requests[i]]
        used.add(i)

        for j in range(
            i + 1,
            len(feature_requests)
        ):

            if j in used:
                continue

            similarity = cosine_similarity(
                [embeddings[i]],
                [embeddings[j]]
            )[0][0]

            if similarity >= SIMILARITY_THRESHOLD:

                cluster.append(
                    feature_requests[j]
                )

                used.add(j)

        clusters.append(cluster)

    structured_clusters = []

    for cluster in clusters:

        total_request_count = sum(
            item["request_count"]
            for item in cluster
        )

        all_original_requests = []

        for item in cluster:
            all_original_requests.extend(
                item["original_requests"]
            )

        structured_clusters.append({
            "feature": cluster[0]["feature"],
            "request_count": total_request_count,
            "original_requests": all_original_requests
        })

    return structured_clusters