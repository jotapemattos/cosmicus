import React from 'react'
import CtProblemsList from '../components/ct-problems-list'
import CtProblemSymbol from '../components/ct-problem-symbol'

const SpaceMissionPlanner = () => {
  return (
    <main className="h-full w-full p-4 md:p-0">
      <section className="mx-auto my-32 md:max-w-screen-md md:p-0 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex flex-col gap-12 md:flex-row">
          <CtProblemSymbol category="space-mission-planner" />
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl font-bold">
              Planejador de Missão Espacial
            </h2>
            <p className="text-muted-foreground">
              Embarque em uma jornada de{' '}
              <strong className="text-white">Decomposição de Problemas</strong>
              enquanto planeja e executa uma missão espacial complexa! Aprenda a
              decompor grandes desafios em tarefas gerenciáveis, passo a passo.
            </p>
            <p className="text-muted-foreground">
              Navegue por diferentes etapas da missão, desde a Preparação de
              Lançamento até a Viagem Interplanetária, completando tarefas
              específicas com diferentes níveis de dificuldade. Descubra como
              problemas complexos podem ser resolvidos abordando objetivos
              menores e focados.
            </p>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Objetivos de Aprendizagem:
              </h3>
              <ul className="list-inside list-disc text-muted-foreground">
                <li>
                  Decompor grandes problemas em tarefas menores e gerenciáveis
                </li>
                <li>Organizar tarefas hierarquicamente</li>
                <li>
                  Compreender a importância da resolução de problemas passo a
                  passo
                </li>
                <li>Desenvolver habilidades de planejamento estratégico</li>
                <li>
                  Aprender a gerenciar fluxos de trabalho de missões complexas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <CtProblemsList category="space-mission-planner" />
    </main>
  )
}

export default SpaceMissionPlanner
