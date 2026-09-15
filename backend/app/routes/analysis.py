from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.config.database import (
    analyses_collection,
    feedback_collection,
    workspaces_collection
)

from app.services.ai_pipeline import analyze_feedback
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/analysis",
    tags=["AI Analysis"]
)


def categorize_feedback(text: str):
    text = text.lower()

    if any(word in text for word in ["payment", "checkout", "transaction", "pay"]):
        if any(word in text for word in ["confusing", "confuse", "difficult"]):
            return "UI/UX Issue"
        return "Payment Issue"

    if any(word in text for word in ["password", "login", "sign in", "reset"]):
        if any(word in text for word in ["slow", "long", "takes too long"]):
            return "Performance Issue"
        return "Authentication Issue"

    if any(
        word in text
        for word in ["slow", "lag", "loading", "performance", "takes too long"]
    ):
        return "Performance Issue"

    if any(
        word in text
        for word in ["confusing", "confuse", "ui", "ux", "design", "layout"]
    ):
        return "UI/UX Issue"

    if any(
        word in text
        for word in ["crash", "crashing", "error", "bug", "not working"]
    ):
        return "Technical Issue"

    return "General Feedback"


# ============================================================
# POST - Run AI Analysis
# ============================================================

@router.post("/{workspace_id}")
def analyze_workspace(
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

    # --------------------------------------------------------
    # Convert database feedback into AI pipeline format
    # --------------------------------------------------------

    feedback_data = []

    for feedback in feedbacks:
        feedback_data.append({
            "content": feedback.get("text", ""),
            "source": feedback.get("source", "customer"),
            "date": feedback.get("date") or feedback.get("created_at")
        })

    # --------------------------------------------------------
    # Run AI Pipeline
    # --------------------------------------------------------

    try:
        ai_result = analyze_feedback(feedback_data)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # --------------------------------------------------------
    # Save analysis result to MongoDB
    # --------------------------------------------------------

    analysis = {
        "workspace_id": ObjectId(workspace_id),

        "total_feedback": len(feedbacks),

        # New AI Pipeline Results
        "cleaned_feedback": ai_result.get(
            "cleaned_feedback",
            []
        ),

        "themes": ai_result.get(
            "themes",
            []
        ),

        "pain_points": ai_result.get(
            "pain_points",
            []
        ),

        "feature_requests": ai_result.get(
            "feature_requests",
            []
        ),

        "feature_clusters": ai_result.get(
            "feature_clusters",
            []
        ),

        "trend_analysis": ai_result.get(
            "trend_analysis",
            {}
        ),

        # Compatibility fields
        # These are kept so existing frontend/backend
        # functionality does not immediately break.
        "problems": ai_result.get(
            "pain_points",
            []
        ),

        "priorities": [],

        "recommendations": [],

        "status": "completed",

        "created_at": datetime.now(timezone.utc)
    }

    result = analyses_collection.insert_one(analysis)

    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {
        "message": "AI analysis completed successfully",

        "analysis_id": str(
            result.inserted_id
        ),

        "workspace_id": workspace_id,

        "total_feedback": len(feedbacks),

        "status": "completed",

        # New AI results
        "cleaned_feedback": ai_result.get(
            "cleaned_feedback",
            []
        ),

        "themes": ai_result.get(
            "themes",
            []
        ),

        "pain_points": ai_result.get(
            "pain_points",
            []
        ),

        "feature_requests": ai_result.get(
            "feature_requests",
            []
        ),

        "feature_clusters": ai_result.get(
            "feature_clusters",
            []
        ),

        "trend_analysis": ai_result.get(
            "trend_analysis",
            {}
        ),

        # Compatibility fields
        "problems": ai_result.get(
            "pain_points",
            []
        ),

        "priorities": [],

        "recommendations": []
    }


# ============================================================
# GET - Insights
# ============================================================

@router.get("/insights/{workspace_id}")
def get_insights(
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
    feedbacks = list(
        feedback_collection.find({
            "workspace_id": ObjectId(workspace_id)
        })
    )

    if not feedbacks:
        raise HTTPException(
            status_code=404,
            detail="No feedback found"
        )

    # --------------------------------------------------------
    # Category distribution
    # --------------------------------------------------------

    category_counts = {}

    for feedback in feedbacks:
        category = feedback.get("category")

        if not category:
            category = categorize_feedback(
                feedback.get("text", "")
            )

        category_counts[category] = (
            category_counts.get(category, 0) + 1
        )

    category_distribution = []

    for category, count in category_counts.items():
        category_distribution.append({
            "category": category,
            "count": count
        })

    category_distribution.sort(
        key=lambda x: x["count"],
        reverse=True
    )

    # --------------------------------------------------------
    # Top category
    # --------------------------------------------------------

    top_category = (
        category_distribution[0]
        if category_distribution
        else None
    )

    # --------------------------------------------------------
    # Trends
    # --------------------------------------------------------

    trends = []

    for item in category_distribution:
        percentage = round(
            (item["count"] / len(feedbacks)) * 100,
            2
        )

        trends.append({
            "category": item["category"],
            "count": item["count"],
            "percentage": percentage
        })

    return {
        "workspace_id": workspace_id,

        "total_feedback": len(feedbacks),

        "top_category": (
            top_category["category"]
            if top_category
            else None
        ),

        "top_category_count": (
            top_category["count"]
            if top_category
            else 0
        ),

        "category_distribution": category_distribution,

        "trends": trends
    }


# ============================================================
# GET - Feature Requests
# ============================================================

@router.get("/features/{workspace_id}")
def get_feature_requests(
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
        sort=[
            ("created_at", -1)
        ]
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="No AI analysis found. Please run analysis first."
        )

    # --------------------------------------------------------
    # New AI pipeline feature requests
    # --------------------------------------------------------

    feature_requests = analysis.get(
        "feature_requests",
        []
    )

    feature_clusters = analysis.get(
        "feature_clusters",
        []
    )

    # If feature clusters exist, return them
    if feature_clusters:
        return {
            "workspace_id": workspace_id,

            "total_feature_opportunities": len(
                feature_clusters
            ),

            "feature_opportunities": feature_clusters
        }

    # --------------------------------------------------------
    # Fallback to feature requests
    # --------------------------------------------------------

    aggregated_features = []

    for feature in feature_requests:

        feature_name = feature.get(
            "feature",
            "Unnamed Feature"
        )

        description = feature.get(
            "description",
            ""
        )

        request_count = feature.get(
            "request_count",
            0
        )

        original_requests = feature.get(
            "original_requests",
            []
        )

        aggregated_features.append({
            "feature": feature_name,
            "description": description,
            "request_count": request_count,
            "original_requests": original_requests
        })

    return {
        "workspace_id": workspace_id,

        "total_feature_opportunities": len(
            aggregated_features
        ),

        "feature_opportunities": aggregated_features
    }


# ============================================================
# GET - Latest AI Analysis
# ============================================================

@router.get("/{workspace_id}")
def get_latest_analysis(
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

    # Get latest analysis
    analysis = analyses_collection.find_one(
        {
            "workspace_id": ObjectId(workspace_id)
        },
        sort=[
            ("created_at", -1)
        ]
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="No analysis found for this workspace"
        )

    return {
        "analysis_id": str(
            analysis["_id"]
        ),

        "workspace_id": workspace_id,

        "total_feedback": analysis.get(
            "total_feedback",
            0
        ),

        # New AI pipeline fields
        "cleaned_feedback": analysis.get(
            "cleaned_feedback",
            []
        ),

        "themes": analysis.get(
            "themes",
            []
        ),

        "pain_points": analysis.get(
            "pain_points",
            []
        ),

        "feature_requests": analysis.get(
            "feature_requests",
            []
        ),

        "feature_clusters": analysis.get(
            "feature_clusters",
            []
        ),

        "trend_analysis": analysis.get(
            "trend_analysis",
            {}
        ),

        # Compatibility fields
        "problems": analysis.get(
            "problems",
            []
        ),

        "priorities": analysis.get(
            "priorities",
            []
        ),

        "recommendations": analysis.get(
            "recommendations",
            []
        ),

        "status": analysis.get(
            "status"
        ),

        "created_at": analysis.get(
            "created_at"
        )
    }