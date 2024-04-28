import { GeistSans } from 'geist/font/sans'
import './globals.css'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { ReactQueryClientProvider } from '@/components/react-query-client-provider'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'TCC',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <ReactQueryClientProvider>
        <body className="max-w-screen bg-background text-foreground">
          <Header />
          <main className="flex min-h-screen flex-col items-center">
            {children}
          </main>
          <Toaster richColors />
        </body>
      </ReactQueryClientProvider>
    </html>
  )
}
