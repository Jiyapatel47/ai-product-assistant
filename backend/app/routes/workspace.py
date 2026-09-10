from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.config.database import workspaces_collection
from app.schemas.workspace import WorkspaceCreate
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/workspaces",
    tags=["Workspaces"]
)


@router.post("/")
def create_workspace(
    workspace: WorkspaceCreate,
    current_user=Depends(get_current_user)
):
    new_workspace = {
        "name": workspace.name,
        "description": workspace.description,
        "owner_id": current_user["_id"],
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    result = workspaces_collection.insert_one(new_workspace)

    return {
        "message": "Workspace created successfully",
        "workspace_id": str(result.inserted_id)
    }


@router.get("/")
def get_workspaces(
    current_user=Depends(get_current_user)
):
    workspaces = workspaces_collection.find({
        "owner_id": current_user["_id"]
    })

    result = []

    for workspace in workspaces:
        result.append({
            "id": str(workspace["_id"]),
            "name": workspace["name"],
            "description": workspace.get("description"),
            "created_at": workspace["created_at"]
        })

    return {
        "workspaces": result
    }


@router.get("/{workspace_id}")
def get_workspace(
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

    return {
        "id": str(workspace["_id"]),
        "name": workspace["name"],
        "description": workspace.get("description"),
        "created_at": workspace["created_at"]
    }