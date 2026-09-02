from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.config.database import (
    analyses_collection,
    feedback_collection,
    workspaces_collection
)

from app.services.gemini_service import analyze_feedback
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/analysis",
    tags=["AI Analysis"]
)


# ==========================================
# POST: Create AI Analysis
# ==========================================

@router.post("/{workspace_id}")
def analyze_workspace(
    workspace_id: str,
    current_user=Depends(get_current_user)
):

    # 1. Validate workspace ID
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace ID"
        )

    # 2. Check workspace belongs to current user
    workspace = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    # 3. Get feedback
    feedbacks = list(
        feedback_collection.find({
            "workspace_id": ObjectId(workspace_id)
        })
    )

    if not feedbacks:
        raise HTTPException(
            status_code=404,
            detail="No feedback found for this workspace"
        )

    # 4. Extract feedback text
    feedback_texts = [
        feedback["text"]
        for feedback in feedbacks
    ]

    # 5. Send feedback to Gemini AI
    try:
        ai_result = analyze_feedback(feedback_texts)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # 6. Save analysis in MongoDB
    analysis = {
        "workspace_id": ObjectId(workspace_id),
        "total_feedback": len(feedbacks),
        "problems": ai_result.get("problems", []),
        "themes": ai_result.get("themes", []),
        "feature_requests": ai_result.get("feature_requests", []),
        "priorities": ai_result.get("priorities", []),
        "recommendations": ai_result.get("recommendations", []),
        "status": "completed",
        "created_at": datetime.now(timezone.utc)
    }

    result = analyses_collection.insert_one(analysis)

    # 7. Return newly created analysis
    return {
        "message": "AI analysis completed successfully",
        "analysis_id": str(result.inserted_id),
        "workspace_id": workspace_id,
        "total_feedback": len(feedbacks),
        "status": "completed",
        "problems": ai_result.get("problems", []),
        "themes": ai_result.get("themes", []),
        "feature_requests": ai_result.get("feature_requests", []),
        "priorities": ai_result.get("priorities", []),
        "recommendations": ai_result.get("recommendations", [])
    }


# ==========================================
# GET: Get Latest Saved Analysis
# ==========================================

@router.get("/{workspace_id}")
def get_latest_analysis(
    workspace_id: str,
    current_user=Depends(get_current_user)
):

    # 1. Validate workspace ID
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace ID"
        )

    # 2. Check workspace belongs to current user
    workspace = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    # 3. Get latest analysis from MongoDB
    analysis = analyses_collection.find_one(
        {
            "workspace_id": ObjectId(workspace_id)
        },
        sort=[("created_at", -1)]
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="No analysis found for this workspace"
        )

    # 4. Return saved analysis
    return {
        "analysis_id": str(analysis["_id"]),
        "workspace_id": workspace_id,
        "total_feedback": analysis.get("total_feedback", 0),
        "problems": analysis.get("problems", []),
        "themes": analysis.get("themes", []),
        "feature_requests": analysis.get("feature_requests", []),
        "priorities": analysis.get("priorities", []),
        "recommendations": analysis.get("recommendations", []),
        "status": analysis.get("status"),
        "created_at": analysis.get("created_at")
    }