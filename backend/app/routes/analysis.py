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
# HELPER: Categorize Feedback
# ==========================================

def categorize_feedback(text: str):

    text = text.lower()

    # Payment issues
    if any(word in text for word in [
        "payment",
        "checkout",
        "transaction",
        "pay"
    ]):
        if any(word in text for word in [
            "confusing",
            "confuse",
            "difficult"
        ]):
            return "UI/UX Issue"

        return "Payment Issue"

    # Authentication issues
    if any(word in text for word in [
        "password",
        "login",
        "sign in",
        "reset"
    ]):
        if any(word in text for word in [
            "slow",
            "long",
            "takes too long"
        ]):
            return "Performance Issue"

        return "Authentication Issue"

    # Performance issues
    if any(word in text for word in [
        "slow",
        "lag",
        "loading",
        "performance",
        "takes too long"
    ]):
        return "Performance Issue"

    # UI/UX issues
    if any(word in text for word in [
        "confusing",
        "confuse",
        "ui",
        "ux",
        "design",
        "layout"
    ]):
        return "UI/UX Issue"

    # Technical issues
    if any(word in text for word in [
        "crash",
        "crashing",
        "error",
        "bug",
        "not working"
    ]):
        return "Technical Issue"

    return "General Feedback"


# ==========================================
# POST: Create AI Analysis
# ==========================================

@router.post("/{workspace_id}")
def analyze_workspace(
    workspace_id: str,
    current_user=Depends(get_current_user)
):

    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace ID"
        )

    workspace = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

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

    feedback_texts = [
        feedback["text"]
        for feedback in feedbacks
    ]

    try:
        ai_result = analyze_feedback(feedback_texts)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    analysis = {
        "workspace_id": ObjectId(workspace_id),
        "total_feedback": len(feedbacks),
        "problems": ai_result.get("problems", []),
        "themes": ai_result.get("themes", []),
        "feature_requests": ai_result.get(
            "feature_requests",
            []
        ),
        "priorities": ai_result.get("priorities", []),
        "recommendations": ai_result.get(
            "recommendations",
            []
        ),
        "status": "completed",
        "created_at": datetime.now(timezone.utc)
    }

    result = analyses_collection.insert_one(analysis)

    return {
        "message": "AI analysis completed successfully",
        "analysis_id": str(result.inserted_id),
        "workspace_id": workspace_id,
        "total_feedback": len(feedbacks),
        "status": "completed",
        "problems": ai_result.get("problems", []),
        "themes": ai_result.get("themes", []),
        "feature_requests": ai_result.get(
            "feature_requests",
            []
        ),
        "priorities": ai_result.get("priorities", []),
        "recommendations": ai_result.get(
            "recommendations",
            []
        )
    }


# ==========================================
# GET: Feedback Insights & Trend Analysis
# ==========================================

@router.get("/insights/{workspace_id}")
def get_insights(
    workspace_id: str,
    current_user=Depends(get_current_user)
):

    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace ID"
        )

    workspace = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

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

    top_category = (
        category_distribution[0]
        if category_distribution
        else None
    )

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


# ==========================================
# GET: Feature Request Aggregation
# IMPORTANT: Keep BEFORE /{workspace_id}
# ==========================================

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
        sort=[("created_at", -1)]
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="No AI analysis found. Please run analysis first."
        )

    feature_requests = analysis.get(
        "feature_requests",
        []
    )

    priorities = analysis.get(
        "priorities",
        []
    )

    # Aggregate features
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

        # Default priority
        priority = "Medium"

        feature_lower = feature_name.lower()

        # Match feature with AI priority
        for item in priorities:

            issue = item.get(
                "issue",
                ""
            ).lower()

            if (
                "payment" in feature_lower
                or "checkout" in feature_lower
            ):
                if (
                    "payment" in issue
                    or "checkout" in issue
                ):
                    priority = item.get(
                        "priority",
                        "High"
                    )

            elif "password" in feature_lower:

                if (
                    "password" in issue
                    or "reset" in issue
                ):
                    priority = item.get(
                        "priority",
                        "Medium"
                    )

        aggregated_features.append({
            "feature": feature_name,
            "description": description,
            "priority": priority
        })

    return {
        "workspace_id": workspace_id,
        "total_feature_opportunities": len(
            aggregated_features
        ),
        "feature_opportunities": aggregated_features
    }


# ==========================================
# GET: Get Latest Saved AI Analysis
# IMPORTANT: Keep this LAST
# ==========================================

@router.get("/{workspace_id}")
def get_latest_analysis(
    workspace_id: str,
    current_user=Depends(get_current_user)
):

    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace ID"
        )

    workspace = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_id": current_user["_id"]
    })

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

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

    return {
        "analysis_id": str(analysis["_id"]),
        "workspace_id": workspace_id,
        "total_feedback": analysis.get(
            "total_feedback",
            0
        ),
        "problems": analysis.get(
            "problems",
            []
        ),
        "themes": analysis.get(
            "themes",
            []
        ),
        "feature_requests": analysis.get(
            "feature_requests",
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
        "status": analysis.get("status"),
        "created_at": analysis.get("created_at")
    }