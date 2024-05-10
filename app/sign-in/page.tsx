'use client'

import Link from 'next/link'
import GithubAuthButton from '@/components/github-auth-button'
import GoogleAuthButton from '@/components/google-auth-button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signIn } from '../actions/sign-in'
import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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
    <div className="flex w-full flex-1 flex-col justify-center gap-2 overflow-y-hidden px-8 sm:max-w-md">
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in"
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          placeholder="you@example.com"
          required
          {...register('email')}
        />
        <label className="text-md" htmlFor="password">
          Senha
        </label>
        <div className="relative mb-6 flex items-center">
          <input
            className="w-full rounded-md border bg-inherit px-4 py-2"
            type={shouldShowPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
            {...register('password')}
          />
          <button
            className="absolute right-2 rounded-md border bg-secondary p-1"
            type="button"
            onClick={() => setShouldShowPassword((prev) => !prev)}
          >
            <EyeOff
              size={20}
              className={`absolute transition-all ${shouldShowPassword ? 'transition-y-1 scale-100' : 'scale-0'}`}
            />
            <Eye
              size={20}
              className={`transition-all ${shouldShowPassword ? 'transition-y-1 scale-0' : 'scale-100'}`}
            />
          </button>
        </div>
        <button
          type="submit"
          className="mb-2 flex items-center justify-center gap-2 rounded-md border border-foreground/20 bg-primary px-4 py-2 text-secondary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Entrando...</span>
            </>
          ) : (
            <span>Entrar</span>
          )}
        </button>
        {searchParams?.message && (
          <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
            {searchParams.message}
          </p>
        )}
        <p>
          Não possui uma conta?{' '}
          <Link href="/sign-up" className="font-bold">
            Criar agora
          </Link>
        </p>
      </form>
      <GithubAuthButton />
      <GoogleAuthButton />
    </div>
  )
}
