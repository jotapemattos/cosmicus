import { GeistSans } from 'geist/font/sans'
import './globals.css'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { ReactQueryClientProvider } from '@/components/react-query-client-provider'
import { createClient } from '@/utils/supabase/server'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'TCC',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <ReactQueryClientProvider>
        <body className="max-w-screen bg-background">
          {user && <Header />}
          <main className="flex min-h-screen flex-col items-center">
            {children}
          </main>
          <Toaster richColors />
        </body>
      </ReactQueryClientProvider>
    </html>
  )
}
