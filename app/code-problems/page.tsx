import Problems from '@/app/code-problems/components/problems'

export default function Page() {
  return (
    <main className="h-full h-screen w-full space-y-16 p-4 pt-24 md:px-0">
      <section className="mx-auto mt-12 max-w-screen-2xl flex-col space-y-4 md:flex-row">
        <h1 className="text-4xl font-extrabold">Algoritmos</h1>
        <p className="text-muted-foreground">
          Enfrente desafios de algoritmos para{' '}
          <strong className="text-white">explorar a galáxia</strong>. Clique nos
          planetas para iniciar sua{' '}
          <strong className="text-white">jornada.</strong>
        </p>
      </section>
      <Problems />
    </main>
  )
}
