'use client'

import React, { useState } from 'react'
import NavLinks from './nav-links'
import { Button } from './ui/button'
import { SheetTrigger, SheetContent, Sheet, SheetTitle } from './ui/sheet'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface MobileNavProps {
  children: React.ReactNode
}

const MobileNav: React.FC<MobileNavProps> = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full overflow-y-scroll">
        <SheetTitle>
          <Button asChild variant={'ghost'} onClick={() => setOpen(false)}>
            <Link href={'/'}>
              <Image
                src={'/logo.png'}
                alt="Imagem de Logo"
                width={32}
                height={32}
              />
            </Link>
          </Button>
        </SheetTitle>
        <div className="flex h-full flex-col justify-between gap-6 py-4">
          <div className="mt-8 flex flex-col items-start gap-4">
            <NavLinks onClose={() => setOpen(false)} />
          </div>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
