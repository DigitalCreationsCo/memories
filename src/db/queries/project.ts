"use server"
import { createAnonClient } from "../client"
import { Project, CreateProjectInput, ProjectError } from "@/types/project.types"

export async function getProjects(projectId: string): Promise<Project> {
  try {
    const client = createAnonClient()
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) throw new ProjectError(error.message)
    if (!data) throw new ProjectError('Project not found')

    return data
  } catch (error) {
    if (error instanceof ProjectError) throw error
    throw new ProjectError('Failed to fetch project')
  }
}

export async function getProject(projectId: string): Promise<Project> {
  try {
    const client = createAnonClient()
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) throw new ProjectError(error.message)
    if (!data) throw new ProjectError('Project not found')

    return data
  } catch (error) {
    if (error instanceof ProjectError) throw error
    throw new ProjectError('Failed to fetch project')
  }
}

export async function createProject({ name, description, user_id }: CreateProjectInput): Promise<Project> {
  try {
    const client = createAnonClient()
    const { data, error } = await client
      .from('projects')
      .insert({ name, description, user_id })
      .select()
      .single()

    if (error) throw new ProjectError(error.message)
    if (!data) throw new ProjectError('Failed to create project')

    return data as any
  } catch (error) {
    if (error instanceof ProjectError) throw error
    throw new ProjectError('Failed to create project')
  }
}

export async function updateProject(projectId: string, projectData: Partial<Project>): Promise<Project> {
  try {
    const client = createAnonClient()
    const { data, error } = await client
      .from('projects')
      .update(projectData)
      .eq('id', projectId)
      .select()
      .single()

    if (error) throw new ProjectError(error.message)
        if (!data) throw new ProjectError('Project not found')

    return data
  } catch (error) {
    if (error instanceof ProjectError) throw error
    throw new ProjectError('Failed to update project')
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    const client = createAnonClient()
    const { error } = await client
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) throw new ProjectError(error.message)
  } catch (error) {
    if (error instanceof ProjectError) throw error
    throw new ProjectError('Failed to delete project')
  }
}
