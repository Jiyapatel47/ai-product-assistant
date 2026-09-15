from embeddings import create_embedding


texts = [
    "App crashes frequently",
    "The application keeps crashing",
    "Please add dark mode"
]


for text in texts:

    embedding = create_embedding(text)

    print("\nText:", text)
    print("Embedding length:", len(embedding))
    print("First 5 values:", embedding[:5])
    