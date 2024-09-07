'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from '../actions/sign-in'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import landscape from '@/assets/space-landscape.png'
import GithubAuthButton from '@/components/github-auth-button'
import GoogleAuthButton from '@/components/google-auth-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInSchema = z.object({
  email: z.string().email({
    message: 'Email inválido',
  }),
  password: z.string(),
})

type SignInSchema = z.infer<typeof signInSchema>

export default function Page({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const [shouldShowPassword, setShouldShowPassword] = useState(false)

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
    <div className="h-screen max-h-screen w-full max-w-screen-2xl overflow-hidden lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden rounded-md py-24 lg:block">
        <Image
          src={landscape.src}
          alt="Space landscape"
          // fill
          // objectFit="contain"
          // objectFit="cover"
          width={1600}
          height={1200}
          className="h-[800px] w-fit rounded-lg bg-red-500"
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="mx-auto grid w-2/3 gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Digite seu email abaixo para entrar em sua conta.
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSignIn)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={shouldShowPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  required
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
          <div className="grid gap-2">
            <GithubAuthButton />
            <GoogleAuthButton />
          </div>
          {searchParams?.message && (
            <p className="bg-muted p-4 text-center text-sm">
              {searchParams.message}
            </p>
          )}
          <div className="mt-4 text-center text-sm">
            Não possui uma conta?{' '}
            <Link href="/sign-up" className="font-medium underline">
              Criar agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
