import Problems from '@/components/problems'

export default function Page() {
  return (
    <section className="mx-auto mt-36 flex w-full max-w-screen-2xl flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-extrabold">Desafios</h1>
      <Problems />
    </section>
  )
}
