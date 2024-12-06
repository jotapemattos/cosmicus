import React from 'react'
import CtProblemsList from '../components/ct-problems-list'
import CtProblemSymbol from '../components/ct-problem-symbol'

const SpaceResourceManagement = () => {
  return (
    <main className="h-full w-full p-4 md:p-0">
      <section className="mx-auto my-32 md:max-w-screen-md md:p-0 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex flex-col gap-12 md:flex-row">
          <CtProblemSymbol category="space-resource-management" />
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl font-bold">
              Gerenciamento de Recursos Espaciais
            </h2>
            <p className="text-muted-foreground">
              Mergulhe no mundo da{' '}
              <strong className="text-white">Abstração</strong>
              com este desafio de gerenciamento de recursos de estação espacial!
              Aprenda a criar sistemas complexos decompondo-os em componentes
              simplificados e bem definidos. Sua missão é construir uma estação
              espacial estável, gerenciando diferentes tipos de recursos
              críticos.
            </p>
            <p className="text-muted-foreground">
              Use uma classe base abstrata para definir uma interface comum para
              diferentes recursos espaciais como Células de Energia,
              Reservatórios de Água e Geradores de Oxigênio. Balance e otimize
              seus recursos para garantir a sobrevivência da tripulação da
              estação espacial.
            </p>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Objetivos de Aprendizagem:
              </h3>
              <ul className="list-inside list-disc text-muted-foreground">
                <li>Compreender classes base abstratas e interfaces</li>
                <li>
                  Criar implementações concretas com comportamentos únicos
                </li>
                <li>
                  Representar sistemas complexos através de modelos
                  simplificados
                </li>
                <li>
                  Praticar gerenciamento de recursos e pensamento estratégico
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <CtProblemsList category="space-resource-management" />
    </main>
  )
}

export default SpaceResourceManagement
