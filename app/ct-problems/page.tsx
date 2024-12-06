import {
  CardContainer,
  CardBody,
  CardItem,
} from '@/components/magic-ui/3d-card'
import Image from 'next/image'

type Pillar =
  | 'Reconhecimento de Padrões'
  | 'Abstração'
  | 'Decomposição de Problemas'

type Category = {
  name: string
  href: string
  image: string
}

type PillarCategories = {
  pillar: Pillar
  categories: Category[]
}

export default function Page() {
  const categories: PillarCategories[] = [
    {
      pillar: 'Reconhecimento de Padrões',
      categories: [
        {
          href: 'rush-hour',
          image: '/car.png',
          name: 'Hora do Rush',
        },
      ],
    },
    {
      pillar: 'Decomposição de Problemas',
      categories: [
        {
          href: 'space-mission-planner',
          image: '/clipboard.png',
          name: 'Planejador de missão espacial',
        },
      ],
    },
    {
      pillar: 'Abstração',
      categories: [
        {
          href: 'space-resource-management',
          image: '/numbers-soup.png',
          name: 'Gerenciamento de material espacial',
        },
      ],
    },
  ]

  return (
    <section className="mx-auto mt-24 flex w-full flex-col justify-center p-4 md:max-w-screen-md md:p-0 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Academia de Jogos Galácticos</h1>
        <p className="text-muted-foreground md:max-w-[600px]">
          Enfrente desafios de{' '}
          <strong className="text-white">
            Reconhecimento de Padrões, Abstração e Decomposição de Problemas{' '}
          </strong>{' '}
          para desenvolver seu raciocínio como tripulante. Cada problema é uma
          nova missão que coloca suas capacidades à prova e o aproxima de se
          tornar um verdadeiro mestre em comandar uma nave espacial!
        </p>
      </div>
      {categories.map((category) => (
        <div key={category.pillar} className="my-10 space-y-5">
          <h2 className="text-center text-3xl font-medium md:text-start">
            {category.pillar}
          </h2>
          <div className="flex w-full flex-wrap items-center justify-center gap-12 md:justify-start">
            {category.categories.map((item) => (
              <CardContainer
                className="inter-var max-w-72"
                href={`/ct-problems/${item.href}`}
                key={item.name}
              >
                <div className="rounded-xl bg-border from-indigo-400 to-indigo-600 p-[1px] group-hover:bg-gradient-to-tr">
                  <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] bg-background  p-8">
                    <CardItem translateZ="100" className="mt-4 w-full">
                      <Image
                        src={item.image}
                        height="1000"
                        width="1000"
                        className="h-32 w-full rounded-xl object-cover px-12"
                        alt="thumbnail"
                      />
                    </CardItem>
                    <CardItem translateZ="100" className="mx-auto mt-4">
                      <h2 className="text-wrap text-2xl font-bold">
                        {item.name}
                      </h2>
                    </CardItem>
                  </CardBody>
                </div>
              </CardContainer>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
