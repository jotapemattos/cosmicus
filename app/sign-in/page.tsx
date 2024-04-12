import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SubmitButton } from './submit-button'
import GithubAuthButton from '@/components/github-auth-button'
import GoogleAuthButton from '@/components/google-auth-button'

export default async function Page({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/sign-in?message=Could not authenticate user')
    }

    return redirect('/')
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 overflow-y-hidden px-8 sm:max-w-md">
      <form className="animate-in flex w-full flex-1 flex-col justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
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
