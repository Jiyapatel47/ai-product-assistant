from datetime import datetime, timezone
from io import BytesIO

import pandas as pd
from bson import ObjectId
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.config.database import feedback_collection, workspaces_collection
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/feedback",
    tags=["Feedback"]
)


# ==========================================
# Feedback Categorization Function
# ==========================================

def categorize_feedback(text: str):

    text = text.lower()

    # UI/UX issues - check first
    if any(word in text for word in [
        "confusing", "interface", "ui", "design",
        "difficult to use", "hard to use"
    ]):
        return "UI/UX Issue"

    # Technical issues
    elif any(word in text for word in [
        "crash", "crashing", "error", "bug"
    ]):
        return "Technical Issue"

    # Performance issues
    elif any(word in text for word in [
        "slow", "loading", "takes too long",
        "performance", "lag"
    ]):
        return "Performance Issue"

    # Authentication issues
    elif any(word in text for word in [
        "login", "password", "reset password",
        "authentication", "sign in", "sign-in"
    ]):
        return "Authentication Issue"

    # Feature requests
    elif any(word in text for word in [
        "feature", "add", "please include",
        "would like", "need a new"
    ]):
        return "Feature Request"

    # Payment issues
    elif any(word in text for word in [
        "payment", "checkout", "transaction",
        "billing", "refund"
    ]):
        return "Payment Issue"

    else:
        return "General Feedback"


# ==========================================
# 1. Upload Feedback CSV
# ==========================================

@router.post("/upload/{workspace_id}")
async def upload_feedback(
    workspace_id: str,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    # Validate workspace ID
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace ID"
        )

    # Check workspace ownership
    workspace = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    # Check file type
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed"
        )

    # ==========================================
    # Read CSV File
    # ==========================================

    try:
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read CSV file"
        )

    # Check required column
    if "text" not in df.columns:
        raise HTTPException(
            status_code=400,
            detail="CSV must contain a 'text' column"
        )

    # ==========================================
    # Data Cleaning & Preprocessing
    # ==========================================

    # Keep only text column
    df = df[["text"]].copy()

    # Remove null values
    df = df.dropna()

    # Convert to string
    df["text"] = df["text"].astype(str)

    # Remove extra spaces
    df["text"] = (
        df["text"]
        .str.strip()
        .str.replace(r"\s+", " ", regex=True)
    )

    # Remove empty feedback
    df = df[df["text"] != ""]

    # Remove duplicate feedback inside CSV
    df = df.drop_duplicates(subset=["text"])

    # Create normalized text
    df["normalized_text"] = df["text"].str.lower()

    # Check valid feedback
    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="No valid feedback found in CSV"
        )

    # ==========================================
    # Prepare MongoDB Documents
    # ==========================================

    feedback_documents = []

    for _, row in df.iterrows():

        category = categorize_feedback(
            row["normalized_text"]
        )

        feedback_documents.append({
            "workspace_id": ObjectId(workspace_id),
            "text": row["text"],
            "normalized_text": row["normalized_text"],
            "category": category,
            "created_at": datetime.now(timezone.utc)
        })

    # ==========================================
    # Insert Feedback into MongoDB
    # ==========================================

    result = feedback_collection.insert_many(
        feedback_documents
    )

    return {
        "message": "Feedback uploaded, cleaned and categorized successfully",
        "workspace_id": workspace_id,
        "total_feedback": len(result.inserted_ids)
    }


# ==========================================
# 2. Get All Feedback of a Workspace
# ==========================================

@router.get("/{workspace_id}")
def get_feedback(
    workspace_id: str,
    current_user=Depends(get_current_user)
):

    # Validate workspace ID
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace ID"
        )

    # Check workspace ownership
    workspace = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    # Get feedback
    feedback = feedback_collection.find({
        "workspace_id": ObjectId(workspace_id)
    })

    result = []

    for item in feedback:

        result.append({
            "id": str(item["_id"]),
            "text": item["text"],
            "normalized_text": item.get(
                "normalized_text",
                item["text"].lower()
            ),
            "category": item.get(
                "category",
                categorize_feedback(item["text"])
            ),
            "created_at": item["created_at"]
        })

    return {
        "workspace_id": workspace_id,
        "total_feedback": len(result),
        "feedback": result
    }


# ==========================================
# 3. Delete Feedback
# ==========================================

@router.delete("/{feedback_id}")
def delete_feedback(
    feedback_id: str,
    current_user=Depends(get_current_user)
):

    # Validate feedback ID
    if not ObjectId.is_valid(feedback_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid feedback ID"
        )

    # Find feedback
    feedback = feedback_collection.find_one({
        "_id": ObjectId(feedback_id)
    })

    if not feedback:
        raise HTTPException(
            status_code=404,
            detail="Feedback not found"
        )

    # Check workspace ownership
    workspace = workspaces_collection.find_one({
        "_id": feedback["workspace_id"],
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this feedback"
        )

    # Delete feedback
    feedback_collection.delete_one({
        "_id": ObjectId(feedback_id)
    })

    return {
        "message": "Feedback deleted successfully",
        "feedback_id": feedback_id
    }