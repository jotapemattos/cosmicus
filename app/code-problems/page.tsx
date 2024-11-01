import Problems from '@/app/code-problems/components/problems'

export default function Page() {
  return (
    <main className="h-full min-h-screen w-full space-y-16 p-4 py-24 md:px-0">
      <section className="mx-auto mt-12 max-w-screen-2xl flex-col space-y-4 md:max-w-screen-md md:flex-row lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <h1 className="text-4xl font-extrabold">Algoritmos</h1>
        <p className="text-muted-foreground md:max-w-[600px]">
          Enfrente desafios de algoritmos para{' '}
          <strong className="text-white">explorar a galáxia</strong>. Cada
          problema é uma nova missão que coloca suas capacidades à prova e o
          aproxima de se tornar um verdadeiro comandante espacial do código!
        </p>
      </section>
      <Problems />
    </main>
  )
}
