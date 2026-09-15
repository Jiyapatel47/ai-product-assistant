from sklearn.metrics.pairwise import cosine_similarity

from app.services.embeddings import create_embedding
from app.services.feature_clustering import cluster_feature_requests


feature_requests = [
    # Dark Mode
    {
        "feature": "Dark Mode",
        "description": "Add a dark mode option to the application UI."
    },
    {
        "feature": "Dark Theme",
        "description": "Allow users to switch the application to a dark theme."
    },
    {
        "feature": "Night Mode",
        "description": "Provide a darker interface for users at night."
    },

    # Google Login
    {
        "feature": "Google Login",
        "description": "Allow users to log in using their Google account."
    },
    {
        "feature": "Google Authentication",
        "description": "Implement Google authentication for user login."
    },
    {
        "feature": "Sign in with Google",
        "description": "Let users sign into the application with their Google account."
    },

    # PDF Export
    {
        "feature": "PDF Export",
        "description": "Allow users to export reports as PDF files."
    },
    {
        "feature": "Download Reports as PDF",
        "description": "Users should be able to download their reports in PDF format."
    },
    {
        "feature": "PDF Report Download",
        "description": "Provide an option to save generated reports as PDF documents."
    },

    # Notifications
    {
        "feature": "Email Notifications",
        "description": "Send important product updates and alerts through email."
    },
    {
        "feature": "Push Notifications",
        "description": "Send notifications to users about important events."
    },

    # Clearly unrelated
    {
        "feature": "Payment Integration",
        "description": "Allow users to pay using credit cards and other payment methods."
    }
]


# Create embeddings
embeddings = [
    create_embedding(
        item["feature"] + " " + item["description"]
    )
    for item in feature_requests
]


print("\n===== FEATURE REQUEST CLUSTERS =====")

clusters = cluster_feature_requests(feature_requests)


for index, cluster in enumerate(clusters, start=1):

    print(f"\nCluster {index}:")

    for feature in cluster:
        print(f"- {feature['feature']}")