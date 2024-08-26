import Link from 'next/link'

export default function Page() {
  return (
    <section className="mx-auto mt-36 flex w-full max-w-screen-2xl flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-extrabold">Desafios</h1>
      <Link
        href="/ct-problems/rush-hour/1"
        className="size-40 rounded-lg bg-zinc-400 p-4"
      >
        Rush Hour
      </Link>
    </section>
  )
}
