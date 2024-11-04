import Link from 'next/link'
import Image from 'next/image'
import NavLinks from './nav-links'
import UserSection from './user-section'
import MobileNav from './mobile-nav'
import { CommandMenu } from './command-menu'
import { createClient } from '@/utils/supabase/server'

export default async function Header() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="absolute top-0 flex w-full items-center justify-center border-b bg-background py-2">
      <nav className="mx-auto flex w-full items-center justify-between gap-4 px-2 md:max-w-screen-md md:px-0 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link href={'/'}>
            <Image
              src={'/logo.png'}
              alt="Imagem de Logo"
              width={32}
              height={32}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 lg:flex">
            <NavLinks />
          </div>
        </div>

        <CommandMenu user={user} />

        {/* Desktop User Section */}
        <div className="hidden items-center lg:flex">
          <UserSection />
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <MobileNav>
            <div className="border-t py-4">
              <UserSection />
            </div>
          </MobileNav>
        </div>
      </nav>
    </header>
  )
}
