"use server"

import { v4 as uuidv4 } from "uuid"
import type { Idea, IdeaInput } from "@/lib/types";
import { API_URL } from "@/lib/vars";

export async function getAllIdeas(
): Promise<Idea[]> {
  try {
    let response = await fetch(`${API_URL}/ideas`);
    let data = await response.json();
    if (!data) return [];
    return data as Idea[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Obtener una idea por ID
export async function getIdeaById(id: string): Promise<Idea | null> {
  try {
    const response = await fetch(`${API_URL}/ideas/${id}`);
    const data = await response.json();
    if (!data) return null;
    return data as Idea;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Crear una nueva idea
export async function createIdea(ideaInput: IdeaInput): Promise<Idea> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newIdea: Idea = {
    id: uuidv4(),
    title: ideaInput.title,
    description: ideaInput.description,
    status: ideaInput.status,
    priority: ideaInput.priority,
    created_at: new Date().toISOString(),
  }
  try {
    await fetch(`${API_URL}/ideas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newIdea),
    });
    return newIdea;
  } catch (error) {
    console.log(error);
    return newIdea;
  }
}

// Actualizar una idea existente
export async function updateIdea(idea: Idea, ideas: Idea[]): Promise<Idea> {
  const index = ideas.findIndex((i) => i.id === idea.id)
  if (index === -1) {
    throw new Error("Idea not found")
  }

  ideas[index] = {
    ...ideas[index],
    title: idea.title,
    description: idea.description,
    status: idea.status,
    priority: idea.priority,
  }

  try {
    await fetch(`${API_URL}/ideas/${idea.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idea),
    });
    return ideas[index]
  } catch (error) {
    console.log(error);
    return ideas[index]
  }
}

// Actualizar solo el estado de una idea
export async function updateIdeaStatus(id: string, status: string, ideas: Idea[]): Promise<Idea> {
  const index = ideas.findIndex((i) => i.id === id)
  if (index === -1) {
    throw new Error("Idea not found")
  }

  ideas[index] = {
    ...ideas[index],
    status,
  }

  try {
    await fetch(`${API_URL}/ideas/change_status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return ideas[index]
  } catch (error) {
    console.log(error);
    return ideas[index]
  }
}

// Eliminar una idea
export async function deleteIdea(id: string, ideas: Idea[]): Promise<void> {
  try {
    await fetch(`${API_URL}/ideas/${id}`, {
      method: "DELETE",
    });
    ideas = ideas.filter((idea) => idea.id !== id)
  } catch (error) {
    console.log(error);
  }
}
