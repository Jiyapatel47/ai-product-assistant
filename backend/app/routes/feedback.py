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

    # Read CSV
    try:
        contents = await file.read()

        df = pd.read_csv(
            BytesIO(contents)
        )

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

    # Clean feedback
    df = df[["text"]].dropna()

    df["text"] = (
        df["text"]
        .astype(str)
        .str.strip()
    )

    df = df[df["text"] != ""]

    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="No valid feedback found in CSV"
        )

    # Prepare MongoDB documents
    feedback_documents = []

    for text in df["text"]:

        feedback_documents.append({
            "workspace_id": ObjectId(workspace_id),
            "text": text,
            "created_at": datetime.now(timezone.utc)
        })

    # Insert feedback into MongoDB
    result = feedback_collection.insert_many(
        feedback_documents
    )

    return {
        "message": "Feedback uploaded successfully",
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