import Image from 'next/image'
import React from 'react'
import CtProblemsList from '../components/ct-problems-list'

const RushHourPage = () => {
  return (
    <main className="h-full w-full p-4 md:p-0">
      <section className="mx-auto my-32 max-w-screen-2xl">
        <div className="flex flex-col gap-12 md:flex-row">
          <Image
            src="/car.png"
            alt="Imagem de Carro"
            width={120}
            height={120}
            className="aspect-square h-40 w-40 rounded-xl border bg-gradient-to-tr from-background to-primary/20"
          />
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl font-bold">Hora do Rush</h2>
            <p className="text-muted-foreground">
              Hora do Rush é um desafio de <strong>raciocínio lógico</strong>{' '}
              onde você deve mover os veículos estrategicamente para liberar o
              carro vermelho do congestionamento. Desbloqueie o caminho
              deslizando os carros para frente e para trás, superando obstáculos
              e pensando em cada movimento. Seu objetivo é resolver o
              quebra-cabeça em menos movimentos possíveis, avançando por níveis
              cada vez mais difíceis. Use seu raciocínio para planejar e{' '}
              <strong>liberar o carro vermelho</strong>!
            </p>
          </div>
        </div>
      </section>
      <CtProblemsList category="rush-hour" />
    </main>
  )
}

export default RushHourPage
