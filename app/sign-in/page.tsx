'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from '../actions/sign-in'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import GithubAuthButton from '@/components/github-auth-button'
import GoogleAuthButton from '@/components/google-auth-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

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
    <div className="relative z-0 flex h-screen w-full justify-center bg-violet-700/10 py-20 text-zinc-950">
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-hidden">
        <div className="h-full w-full">
          <Image
            src="/login-background.png"
            width="1920"
            height="1080"
            alt="Menthor login background"
            className="block h-full w-full object-cover object-center"
          />
          <div className="absolute left-0 top-0 h-full w-full"></div>
        </div>
      </div>
      <div className="relative z-10 my-auto flex w-full max-w-[480px] flex-col items-center justify-center gap-6 rounded-2xl bg-zinc-950 p-10 text-white sm:shadow-2xl">
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <Image
            src="/logo.png"
            alt=""
            width={1024}
            height={1024}
            className="aspect-square size-28 object-contain"
          />
          <h1 className="text-2xl font-medium">Continue sua jornada!</h1>
        </div>
        <div className="flex w-full items-center justify-between gap-4">
          <GithubAuthButton />
          <GoogleAuthButton />
        </div>
        <Separator className="border-dashed border-zinc-400" />
        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="grid w-full gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@examplo.com"
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
        {searchParams?.message && (
          <p className="bg-muted p-4 text-center text-sm">
            {searchParams.message}
          </p>
        )}
        <div className="mt-4 text-center text-sm">
          Não possui uma conta?{' '}
          <Link href="/sign-up" className="font-medium underline">
            Criar agora!
          </Link>
        </div>
      </div>
    </div>
  )
}
