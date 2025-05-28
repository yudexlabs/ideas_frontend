"use server"

import { v4 as uuidv4 } from "uuid"
import type { Idea, IdeaInput } from "@/lib/types";
import { API_URL } from "@/lib/vars";

export async function getAllIdeas(
): Promise<Idea[]> {
  try {
    const token = await getToken();
    console.log(token)
    
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
    let response = await fetch(`${API_URL}/ideas`, {headers: headers});
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
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
    const response = await fetch(`${API_URL}/ideas/${id}`, {headers: headers});
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
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
    await fetch(`${API_URL}/ideas`, {
      method: "POST",
      headers: headers,
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
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
    await fetch(`${API_URL}/ideas/${idea.id}`, {
      method: "PUT",
      headers: headers,
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
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
    await fetch(`${API_URL}/ideas/change_status/${id}`, {
      method: "PUT",
      headers: headers,
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
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
    await fetch(`${API_URL}/ideas/${id}`, {
      method: "DELETE",
      headers: headers,
    });
    ideas = ideas.filter((idea) => idea.id !== id)
  } catch (error) {
    console.log(error);
  }
}


export async function getToken(): Promise<string | null> {
  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;

  const formData = new URLSearchParams();
  formData.append("username", username ?? "");
  formData.append("password", password ?? "");

  try {
    const response = await fetch(`${API_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      console.error("Error al obtener el token");
      return null;
    }

    const data = await response.json();
    return data?.access_token;
  } catch (error) {
    console.error("Error en la solicitud de token:", error);
    return null;
  }
}
