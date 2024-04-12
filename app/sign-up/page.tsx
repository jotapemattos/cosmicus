'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { SubmitButton } from '../sign-in/submit-button'
import { signUp } from '../actions/sign-up'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

const emailSchema = z
  .object({
    email: z.string().email({
      message: 'Email inválido',
    }),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]$/,
        'Senha fraca',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas incompatíveis',
    path: ['confirmPassword'],
  })

type EmailSchema = z.infer<typeof emailSchema>

export default function Page({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const [passwordStrength, setPasswordStrength] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
  })

  const password = watch('password')

  useEffect(() => {
    setPasswordStrength(0)
    if (password === undefined) return
    if (password.match('(?=.*d)')) {
      setPasswordStrength((prev) => prev + 20)
    }
    if (password.match('(?=.*[a-z])')) {
      setPasswordStrength((prev) => prev + 20)
    }
    if (password.match('(?=.*[A-Z])')) {
      setPasswordStrength((prev) => prev + 20)
    }
    if (password.match('(?=.*[$*&@#])')) {
      setPasswordStrength((prev) => prev + 20)
    }
    if (password.match('[0-9a-zA-Z$*&@#]')) {
      setPasswordStrength((prev) => prev + 20)
    }
  }, [password])

  const handleSignUp = async ({ email, password }: EmailSchema) => {
    if (!errors.confirmPassword && !errors.email && !errors.password) {
      signUp({ email, password })
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 overflow-y-hidden px-8 sm:max-w-md">
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="animate-in flex w-full flex-1 flex-col justify-center gap-2 text-foreground"
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          placeholder="email@examplo.com"
          required
          {...register('email')}
        />
        {errors.email && (
          <p className="text-md text-red-500">{errors.email.message}</p>
        )}
        <label className="text-md" htmlFor="password">
          Senha
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          placeholder="••••••••"
          required
          {...register('password')}
        />
        {errors.password && (
          <p className="text-md text-red-500">{errors.password.message}</p>
        )}
        <Progress value={passwordStrength} className="bg-red-500" />
        <label className="text-md" htmlFor="confirmPassword">
          Confirme sua senha
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          placeholder="••••••••"
          required
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-md text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
        <SubmitButton
          className="mb-2 rounded-md border border-foreground/20 px-4 py-2 text-foreground"
          pendingText="Signing Up..."
          type="submit"
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
            {searchParams.message}
          </p>
        )}
        <p>
          Já possui uma conta?{' '}
          <Link href="/sign-in" className="font-bold">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
