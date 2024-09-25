import Problems from '@/app/code-problems/components/problems'
import mapBackground from '@/public/map-background.png'

export default function Page() {
  return (
    <div
      style={{ backgroundImage: `url(${mapBackground.src})` }}
      className="h-full min-h-screen w-screen bg-cover bg-fixed bg-center bg-no-repeat"
    >
      <div className="h-full w-full bg-black/70 py-24">
        <section className="mx-auto flex w-full max-w-screen-2xl flex-col space-y-4">
          <Problems />
        </section>
      </div>
    </div>
  )
}
