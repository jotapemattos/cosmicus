import Link from 'next/link'
import Image from 'next/image'
import NavLinks from './nav-links'
import UserSection from './user-section'
import MobileNav from './mobile-nav'

export default async function Header() {
  return (
    <header className="absolute top-0 flex w-full items-center justify-center border-b bg-background py-2">
      <nav className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-2 md:px-0">
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
          <div className="hidden items-center gap-4 md:flex">
            <NavLinks />
          </div>
        </div>

        {/* Desktop User Section */}
        <div className="hidden items-center md:flex">
          <UserSection />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
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
