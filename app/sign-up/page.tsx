'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { signUp } from '../actions/sign-up'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const emailSchema = z
  .object({
    email: z.string().email({
      message: 'Email inválido',
    }),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$&*]).{8,}$/,
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
  searchParams: { message },
}: {
  searchParams: { message: string | null }
}) {
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [shouldShowPasswordInfo, setShouldShowPasswordInfo] = useState(false)
  const [shouldShowPassword, setShouldShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
  })

  const password = watch('password')

  useEffect(() => {
    setPasswordStrength(0)
    if (password === undefined) return
    let strength = 0

    strength += password.length >= 8 ? 20 : 0
    strength += /[a-z]/.test(password) ? 20 : 0
    strength += /[A-Z]/.test(password) ? 20 : 0
    strength += /[0-9]/.test(password) ? 20 : 0
    strength += /(?=.*[!@#$&*])/.test(password) ? 20 : 0

    setPasswordStrength(strength)
  }, [password])

  const handleSignUp = async ({ email, password }: EmailSchema) => {
    if (!errors.confirmPassword && !errors.email && !errors.password) {
      try {
        await signUp({ email, password })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      }
    }
  }

  useEffect(() => {
    if (message) {
      toast.info(message)
    }
  }, [message])

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 overflow-y-hidden px-8 sm:max-w-md">
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in"
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
        <div className="relative flex items-center">
          <input
            className="w-full rounded-md border bg-inherit px-4 py-2"
            type={shouldShowPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
            {...register('password')}
            onFocus={() => setShouldShowPasswordInfo(true)}
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
        {errors.password && (
          <p className="text-md text-red-500">{errors.password.message}</p>
        )}
        {shouldShowPasswordInfo && (
          <div className="animate-accordion-down transition-all duration-300">
            <Progress
              value={passwordStrength}
              className={cn({
                'bg-red-800': passwordStrength === 20,
                'bg-red-500': passwordStrength === 40,
                'bg-orange-500': passwordStrength === 60,
                'bg-yellow-400': passwordStrength === 80,
                'bg-green-500': passwordStrength === 100,
              })}
            />
          </div>
        )}
        <label className="text-md" htmlFor="confirmPassword">
          Confirme sua senha
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type={shouldShowPassword ? 'text' : 'password'}
          placeholder="••••••••"
          required
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-md text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
        <button
          className="mb-2 flex items-center justify-center gap-2 rounded-md border border-foreground/20 bg-primary px-4 py-2 text-secondary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Criando...</span>
            </>
          ) : (
            <span>Criar conta</span>
          )}
        </button>
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
