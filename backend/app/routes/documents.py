from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.config.database import (
    analyses_collection,
    documents_collection,
    workspaces_collection
)

from app.services.prd_service import generate_prd
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/documents",
    tags=["PRD Generation"]
)


# ==========================================
# POST: Generate New PRD
# ==========================================

@router.post("/{workspace_id}")
def create_prd(
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

    # Get latest AI analysis
    analysis = analyses_collection.find_one(
        {
            "workspace_id": ObjectId(workspace_id)
        },
        sort=[("created_at", -1)]
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="No AI analysis found. Please analyze feedback first."
        )

    # Generate PRD using Gemini
    try:
        prd_result = generate_prd(analysis)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PRD generation failed: {str(e)}"
        )

    # Save PRD in MongoDB
    document = {
        "workspace_id": ObjectId(workspace_id),
        "type": "PRD",
        "content": prd_result,
        "status": "completed",
        "created_at": datetime.now(timezone.utc)
    }

    result = documents_collection.insert_one(document)

    return {
        "message": "PRD generated successfully",
        "document_id": str(result.inserted_id),
        "workspace_id": workspace_id,
        "prd": prd_result
    }


# ==========================================
# GET: Fetch Latest Saved PRD
# ==========================================

@router.get("/{workspace_id}")
def get_latest_prd(
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

    # Get latest PRD from MongoDB
    document = documents_collection.find_one(
        {
            "workspace_id": ObjectId(workspace_id),
            "type": "PRD"
        },
        sort=[("created_at", -1)]
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="No PRD found for this workspace"
        )

    return {
        "document_id": str(document["_id"]),
        "workspace_id": workspace_id,
        "type": document.get("type"),
        "prd": document.get("content", {}),
        "status": document.get("status"),
        "created_at": document.get("created_at")
    }