import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

const mdxContent = `
# Bem-vindo à sua Aventura Espacial! 🚀

Olá, futuro explorador espacial! Você está prestes a embarcar em uma incrível jornada pela galáxia do Pensamento Computacional. Nossa nave tem duas áreas super especiais para você explorar:

## 🛸 Área 1: Laboratório de Códigos Espaciais

Nesta área, você será um programador espacial! Aqui você vai:
- Criar instruções especiais para fazer robôs e naves funcionarem
- Resolver missões espaciais usando códigos mágicos
- Ganhar estrelas e medalhas por cada missão completada
- Aprender a pensar como um verdadeiro cientista espacial

É como se você fosse o comandante de uma nave, dando ordens super importantes para sua tripulação. Cada ordem precisa ser bem clara e na sequência certa, senão... ops! A nave pode ir para o lado errado! 😄

## 🎮 Área 2: Academia de Jogos Galácticos

Esta é a área onde você vai treinar seu cérebro com mini-games super divertidos! Aqui você encontrará vários tipos de jogos espaciais que vão te ajudar a:

- Dividir grandes problemas em partes menores (como um quebra-cabeça espacial!)
- Descobrir o que é realmente importante em cada missão
- Encontrar padrões secretos escondidos no espaço

Em cada jogo, você será desafiado de uma forma diferente e divertida. Às vezes você será um explorador procurando pistas, outras vezes um cientista resolvendo mistérios espaciais, ou até mesmo um piloto guiando sua nave por caminhos cheios de desafios!

## 🌟 Por que temos duas áreas diferentes?

Imagine que você está se preparando para ser um super herói espacial:
- Na Área 1, você aprende a dar comandos para suas naves e robôs
- Na Área 2, você treina seu cérebro com jogos divertidos

É como ter dois tipos diferentes de treino:
1. Um onde você aprende a programar suas missões
2. Outro onde você brinca e resolve desafios espaciais

Em cada área você ganha diferentes poderes espaciais:
- Área 1: Poder de criar códigos mágicos
- Área 2: Poderes de observação, resolução de problemas e descoberta de padrões

## 💫 Dica espacial importante:
Você pode alternar entre as duas áreas quando quiser! Se ficar cansado de programar, vá brincar com os jogos. Se quiser criar algo novo, volte para a programação. O importante é se divertir enquanto aprende! 

Pronto para começar sua aventura espacial? Escolha sua primeira missão e... 3, 2, 1... DECOLAR! 🚀
`

const About = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild className="hidden md:flex">
          <Button variant="outline" className="gap-2">
            <Rocket className="h-4 w-4" />
            Sobre o Jogo
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-center text-2xl font-bold">
              Sobre o Jogo
            </SheetTitle>
          </SheetHeader>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{
                __html: mdxContent
                  .split('\n')
                  .map((line) => {
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-2xl font-bold mt-6 mb-4">${line.slice(2)}</h1>`
                    }
                    if (line.startsWith('## ')) {
                      return `<h2 class="text-xl font-semibold mt-6 mb-3">${line.slice(3)}</h2>`
                    }
                    if (line.startsWith('- ')) {
                      return `<li class="ml-4 text-muted-foreground">${line.slice(2)}</li>`
                    }
                    if (line.match(/^\d+\. /)) {
                      return `<li class="ml-4 text-muted-foreground">${line.slice(line.indexOf(' ') + 1)}</li>`
                    }
                    if (line.trim() === '') {
                      return '<br/>'
                    }
                    return `<p class="text-base text-muted-foreground">${line}</p>`
                  })
                  .join('\n'),
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
      <Drawer>
        <DrawerTrigger className="flex md:hidden" asChild>
          <Button variant="outline" className="w-full gap-2">
            <Rocket className="h-4 w-4" />
            Sobre o Jogo
          </Button>
        </DrawerTrigger>
        <DrawerContent className="fixed bottom-0 left-0 right-0 mt-24 flex h-[80%] flex-col rounded-t-[10px] p-8 outline-none lg:h-[320px]">
          <DrawerHeader className="mb-6">
            <DrawerTitle className="text-center text-2xl font-bold">
              Sobre o Jogo
            </DrawerTitle>
          </DrawerHeader>
          <div className="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-y-auto rounded-t-[10px]">
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{
                __html: mdxContent
                  .split('\n')
                  .map((line) => {
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-2xl font-bold mt-6 mb-4">${line.slice(2)}</h1>`
                    }
                    if (line.startsWith('## ')) {
                      return `<h2 class="text-xl font-semibold mt-6 mb-3">${line.slice(3)}</h2>`
                    }
                    if (line.startsWith('- ')) {
                      return `<li class="ml-4 text-muted-foreground">${line.slice(2)}</li>`
                    }
                    if (line.match(/^\d+\. /)) {
                      return `<li class="ml-4 text-muted-foreground">${line.slice(line.indexOf(' ') + 1)}</li>`
                    }
                    if (line.trim() === '') {
                      return '<br/>'
                    }
                    return `<p class="text-base text-muted-foreground">${line}</p>`
                  })
                  .join('\n'),
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default About
