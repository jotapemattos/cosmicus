import Problems from '@/app/code-problems/components/problems'

export default function Page() {
  return (
    <div className="h-full min-h-screen w-full">
      <div className="h-full w-full bg-black/60 py-24">
        <section className="mx-auto flex w-full max-w-screen-2xl flex-col space-y-4">
          <Problems />
        </section>
      </div>
    </div>
  )
}
