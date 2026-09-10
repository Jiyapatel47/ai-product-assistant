from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.config.database import (
    analyses_collection,
    documents_collection,
    roadmaps_collection,
    workspaces_collection
)

from app.services.roadmap_service import generate_roadmap
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/roadmaps",
    tags=["Roadmap Generation"]
)


# ==========================================
# POST: Generate AI Roadmap
# ==========================================

@router.post("/{workspace_id}")
def create_roadmap(
    workspace_id: str,
    current_user=Depends(get_current_user)
):

    # 1. Validate workspace ID
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace ID"
        )

    # 2. Check workspace ownership
    workspace = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    # 3. Get latest AI analysis
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

    # 4. Get latest PRD
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
            detail="No PRD found. Please generate PRD first."
        )

    # 5. Generate roadmap using Gemini
    try:
        roadmap_result = generate_roadmap(
            document["content"],
            analysis
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Roadmap generation failed: {str(e)}"
        )

    # 6. Save roadmap in MongoDB
    roadmap = {
        "workspace_id": ObjectId(workspace_id),
        "content": roadmap_result,
        "status": "completed",
        "created_at": datetime.now(timezone.utc)
    }

    result = roadmaps_collection.insert_one(roadmap)

    # 7. Return roadmap
    return {
        "message": "Roadmap generated successfully",
        "roadmap_id": str(result.inserted_id),
        "workspace_id": workspace_id,
        "roadmap": roadmap_result
    }


# ==========================================
# GET: Fetch Latest Saved Roadmap
# ==========================================

@router.get("/{workspace_id}")
def get_latest_roadmap(
    workspace_id: str,
    current_user=Depends(get_current_user)
):

    # 1. Validate workspace ID
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace ID"
        )

    # 2. Check workspace ownership
    workspace = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    # 3. Get latest roadmap from MongoDB
    roadmap = roadmaps_collection.find_one(
        {
            "workspace_id": ObjectId(workspace_id)
        },
        sort=[("created_at", -1)]
    )

    if not roadmap:
        raise HTTPException(
            status_code=404,
            detail="No roadmap found for this workspace"
        )

    # 4. Return saved roadmap
    return {
        "roadmap_id": str(roadmap["_id"]),
        "workspace_id": workspace_id,
        "roadmap": roadmap.get("content", {}),
        "status": roadmap.get("status"),
        "created_at": roadmap.get("created_at")
    }