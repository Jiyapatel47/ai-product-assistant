import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGODB_URI)

db = client[DATABASE_NAME]

users_collection = db["users"]
workspaces_collection = db["workspaces"]
feedback_collection = db["feedback"]
analyses_collection = db["analyses"]
documents_collection = db["documents"]
roadmaps_collection = db["roadmaps"]