import About from '@/components/about'
import {
  CardContainer,
  CardBody,
  CardItem,
} from '@/components/magic-ui/3d-card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }
  return (
    <main className="min-h-screen w-screen py-12">
      <section className="mx-auto h-full max-w-screen-2xl space-y-12 pt-36">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-7xl font-extrabold md:flex-row">
          <h1>Comece</h1>
          <div>
            <span className="absolute box-content flex w-fit select-none border bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text py-4 text-center text-transparent blur-xl">
              sua jornada
            </span>
            <span className="relative top-0 flex h-auto w-fit select-auto items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text py-4 text-center   text-transparent">
              sua jornada
            </span>
          </div>
        </div>
        <div className="mx-auto flex w-fit items-center gap-4">
          <About />
          <Button asChild variant="outline">
            <Link href="/leaderboard">Ver Ranking</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/shop">Loja</Link>
          </Button>
        </div>
        <div className=" flex flex-col items-center justify-center gap-12 md:flex-row">
          <CardContainer className="inter-var" href="/ct-problems">
            <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] bg-gradient-to-tr from-indigo-500 to-indigo-700 p-8">
              <CardItem translateZ="100" className="mt-4 w-full">
                <Image
                  src="/3d-spaceship.png"
                  height="1000"
                  width="1000"
                  className="h-60 w-full rounded-xl object-cover"
                  alt="thumbnail"
                />
              </CardItem>
              <CardItem translateZ="100" className="mx-auto mt-4">
                <h2 className="text-2xl font-bold">Mini Jogos</h2>
              </CardItem>
            </CardBody>
          </CardContainer>
          <CardContainer className="inter-var" href="/code-problems">
            <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] bg-gradient-to-tr from-indigo-500 to-indigo-700 p-8">
              <CardItem translateZ="100" className="mt-4 w-full">
                <Image
                  src="/3d-planet.png"
                  height="1000"
                  width="1000"
                  className="h-60 w-full rounded-xl object-cover"
                  alt="thumbnail"
                />
              </CardItem>
              <CardItem translateZ="100" className="mx-auto mt-4">
                <h2 className="text-2xl font-bold">Algoritmos</h2>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </section>
    </main>
  )
}
