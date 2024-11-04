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
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import GithubAuthButton from '@/components/github-auth-button'
import GoogleAuthButton from '@/components/google-auth-button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'

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

export default function SignUp() {
  const searchParams = useSearchParams()

  const message = searchParams.get('message')

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
            <CardTitle>Comece sua jornada!</CardTitle>
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

              <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
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
                      onFocus={() => setShouldShowPasswordInfo(true)}
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
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={shouldShowPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      required
                      className="pl-8"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className={cn('w-full', {
                    'opacity-50': isSubmitting,
                  })}
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
                </Button>
              </form>
            </div>
            {message && (
              <p className="bg-muted p-4 text-center text-sm">{message}</p>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-center gap-1">
            <p className="text-sm">Já tem uma conta?</p>
            <Button
              asChild
              variant="link"
              className="p-0 text-sm font-bold text-white"
            >
              <Link href="/sign-in">Entrar agora!</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
