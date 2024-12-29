import { deleteProject, getProject, updateProject } from "@/db/queries/project";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const projectId = request.url.split('/').pop();
        if (!projectId || projectId === 'projects') {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }
        const project = await getProject(projectId);
        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const project = await request.json();
        const projectId = project.id;
        const updatedProject = await updateProject(projectId, project);
        return NextResponse.json(updatedProject);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const projectId = request.url.split('/').pop();
        if (!projectId || projectId === 'projects') {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }
        const deletedProject = await deleteProject(projectId);
        return NextResponse.json(deletedProject);
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}