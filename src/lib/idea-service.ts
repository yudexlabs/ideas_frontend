"use server"

import { v4 as uuidv4 } from "uuid"
import type { Idea, IdeaInput } from "@/lib/types";
import { API_URL } from "@/lib/vars";

// Simulación de base de datos en memoria para demostración
let ideas: Idea[] = [
  {
    _id: "682fafd346c4ac1b0fccf37d",
    title: "Nueva funcionalidad de Copilot en GitHub",
    description: "Nueva funcionalidad de GitHub y Copilot",
    status: "pendiente",
    id: "ce1aeb8d-f95b-4b0a-9f5f-c5f8ce9395d3",
    created_at: "2025-05-22T18:14:27.613Z",
  },
  {
    _id: "682fafd346c4ac1b0fccf37e",
    title: "Diseño minimalista para app de notas",
    description: "Crear una interfaz limpia y futurista para una aplicación de notas con modo oscuro",
    status: "en-progreso",
    id: "7e9a1b2c-3d4e-5f6g-7h8i-9j0k1l2m3n4o",
    created_at: "2025-05-21T14:30:15.000Z",
  },
  {
    _id: "682fafd346c4ac1b0fccf37f",
    title: "Sistema de autenticación biométrica",
    description: "Implementar un sistema de autenticación usando reconocimiento facial y huella digital",
    status: "completado",
    id: "5p6q7r8s-9t0u-1v2w-3x4y-5z6a7b8c9d0e",
    created_at: "2025-05-20T09:45:33.000Z",
  },
]

// Obtener todas las ideas
export async function getAllIdeas(): Promise<Idea[]> {
  try {
    let response = await fetch(`${API_URL}/ideas`);
    let data = await response.json();
    if (!data) return [];
    return data as Idea[];
  }
  catch (error) {
    console.log(error);
    return [];
  }
}

// Obtener una idea por ID
export async function getIdeaById(id: string): Promise<Idea | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return ideas.find((idea) => idea.id === id) || null
}

// Crear una nueva idea
export async function createIdea(ideaInput: IdeaInput): Promise<Idea> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newIdea: Idea = {
    _id: Math.random().toString(36).substring(2, 15),
    id: uuidv4(),
    title: ideaInput.title,
    description: ideaInput.description,
    status: ideaInput.status,
    created_at: new Date().toISOString(),
  }

  ideas = [newIdea, ...ideas]
  return newIdea
}

// Actualizar una idea existente
export async function updateIdea(idea: Idea): Promise<Idea> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = ideas.findIndex((i) => i.id === idea.id)
  if (index === -1) {
    throw new Error("Idea not found")
  }

  ideas[index] = {
    ...ideas[index],
    title: idea.title,
    description: idea.description,
    status: idea.status,
  }

  return ideas[index]
}

// Actualizar solo el estado de una idea
export async function updateIdeaStatus(id: string, status: string): Promise<Idea> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = ideas.findIndex((i) => i.id === id)
  if (index === -1) {
    throw new Error("Idea not found")
  }

  ideas[index] = {
    ...ideas[index],
    status,
  }

  return ideas[index]
}

// Eliminar una idea
export async function deleteIdea(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  ideas = ideas.filter((idea) => idea.id !== id)
}
