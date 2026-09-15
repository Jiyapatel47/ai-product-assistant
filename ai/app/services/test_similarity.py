from similarity import calculate_similarity


text1 = "App crashes frequently"
text2 = "The application keeps crashing"
text3 = "Please add dark mode"


similarity_1 = calculate_similarity(text1, text2)
similarity_2 = calculate_similarity(text1, text3)


print("Similarity between:")
print(f'"{text1}"')
print(f'"{text2}"')
print("Score:", similarity_1)

print("\nSimilarity between:")
print(f'"{text1}"')
print(f'"{text3}"')
print("Score:", similarity_2)