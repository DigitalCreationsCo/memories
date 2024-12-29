"use server"
import supabase from "../client"
import { Project, CreateProjectInput } from "@/types/project.types"
export class ProjectError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'ProjectError'
    }
}

export async function getProjects(projectId: string): Promise<Project> {
  try {
    const client = await supabase()
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
    const client = await supabase()
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

export async function createProject({ name, description }: CreateProjectInput): Promise<Project> {
  try {
    const client = await supabase()
    const { data, error } = await client
      .from('projects')
      .insert({ name, description })
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
    const client = await supabase()
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
    const client = await supabase()
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

export default supabase



  