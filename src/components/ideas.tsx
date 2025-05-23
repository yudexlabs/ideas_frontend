"use client"

import { useState, useEffect } from "react"
import { PlusIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IdeaCard } from "@/components/idea-card"
import { IdeaForm } from "@/components/idea-form"
import { getAllIdeas } from "@/lib/idea-service"
import type { Idea } from "@/lib/types"

export function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const data = await getAllIdeas()
        setIdeas(data)
      } catch (error) {
        console.error("Error loading ideas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadIdeas()
  }, [])

  const handleAddIdea = (newIdea: Idea) => {
    setIdeas((prev) => [newIdea, ...prev])
  }

  const handleUpdateIdea = (updatedIdea: Idea) => {
    setIdeas((prev) => prev.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea)))
  }

  const handleDeleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id))
  }

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-light">Tus ideas</h2>
        <Button
          onClick={() => {
            setEditingIdea(null)
            setIsFormOpen(!isFormOpen)
          }}
          variant="outline"
          className="border-zinc-800 hover:bg-zinc-900 text-zinc-400"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nueva idea
        </Button>
      </div>

      {isFormOpen && (
        <IdeaForm
          onClose={() => setIsFormOpen(false)}
          onIdeaAdded={handleAddIdea}
          onIdeaUpdated={handleUpdateIdea}
          idea={editingIdea}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : ideas.length === 0 ? (
        <div className="border border-zinc-800 rounded-lg p-8 text-center">
          <p className="text-zinc-500">No tienes ideas guardadas. Crea tu primera idea.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onEdit={handleEditIdea}
              onDelete={handleDeleteIdea}
              onStatusChange={handleUpdateIdea}
            />
          ))}
        </div>
      )}
    </div>
  )
}
