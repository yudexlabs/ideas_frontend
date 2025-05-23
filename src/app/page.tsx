import { Ideas } from "@/components/ideas"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">YudexMinds</span>
          </h1>
          <p className="text-zinc-400 text-sm">Captura tus ideas. Evoluciona tu pensamiento.</p>
        </header>
        <Ideas />
      </div>
    </main>
  )
}
