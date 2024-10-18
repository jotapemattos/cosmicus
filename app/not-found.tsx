import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MoveLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <main className="flex h-screen w-full max-w-4xl flex-col items-center justify-center lg:flex-row lg:justify-between">
      <Image
        src="/not-found.png"
        alt="Imagem de 404"
        width={400}
        height={400}
      />
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-6xl font-extrabold sm:text-8xl">Ooops!</h1>
        <p className="text-muted-foreground">
          Parece que você está perdido no espaço...
        </p>
        <Button asChild variant={'outline'}>
          <Link href={'/'} className="flex items-center gap-2">
            <MoveLeft />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </main>
  )
}

export default NotFoundPage
