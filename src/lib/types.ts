export interface Idea {
    _id?: string
    id: string
    title: string
    description: string
    status: string
    priority: "alta" | "media" | "baja"
    created_at?: string
  }
  
  export interface IdeaInput {
    title: string
    description: string
    status: string
    priority: "alta" | "media" | "baja"
  }
  