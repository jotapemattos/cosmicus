'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from '../actions/sign-in'
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react'
import { toast } from 'sonner'
import GithubAuthButton from '@/components/github-auth-button'
import GoogleAuthButton from '@/components/google-auth-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const signInSchema = z.object({
  email: z.string().email({
    message: 'Email inválido',
  }),
  password: z.string(),
})

type SignInSchema = z.infer<typeof signInSchema>

export default function SignIn() {
  const [shouldShowPassword, setShouldShowPassword] = useState(false)

  const searchParams = useSearchParams()

  const message = searchParams.get('message')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  })

  const handleSignIn = async ({ email, password }: SignInSchema) => {
    if (!errors.root) {
      try {
        await signIn({ email, password })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      }
    }
  }

  return (
    <main className="flex h-screen w-full justify-center overflow-hidden p-4 lg:p-0">
      <div className="hidden w-1/2 flex-col gap-8 bg-secondary p-16 py-32 lg:flex">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Imagem de logo"
            width={1024}
            height={1024}
            className="aspect-square size-12 object-contain"
          />
          <h3 className="font-serif text-4xl font-bold italic">Cosmicus</h3>
        </div>
        <Image
          src="/login.png"
          alt="Imagem de robô"
          width={800}
          height={800}
          className="aspect-square h-[500px] w-fit self-center"
        />
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <Card className="mx-auto h-fit w-full max-w-md">
          <CardHeader>
            <CardTitle>Continue sua jornada!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <GithubAuthButton />
                <GoogleAuthButton />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou entre com
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      {...register('email')}
                      required
                      className="pl-8"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={shouldShowPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      required
                      className="pl-8"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShouldShowPassword((prev) => !prev)}
                    >
                      {shouldShowPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn('w-full', {
                    'opacity-50': isSubmitting,
                  })}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <span>Entrar</span>
                  )}
                </Button>
              </form>
            </div>
            {message && (
              <p className="bg-muted p-4 text-center text-sm">{message}</p>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-center gap-1">
            <p className="text-sm">Não possui uma conta?</p>
            <Button
              variant="link"
              className="p-0 text-sm font-bold text-white"
              asChild
            >
              <Link href="/sign-up">Criar agora</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
