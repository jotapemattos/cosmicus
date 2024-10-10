'use client'

import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinksProps {
  onClose?: () => void
}

const NavLinks: React.FC<NavLinksProps> = ({ onClose }) => {
  const pathname = usePathname()
  const routes = [
    {
      href: '/completed-problems',
      label: 'Desafios',
      isActive: pathname === '/completed-problems',
    },
    {
      href: '/leaderboard',
      label: 'Ranking',
      isActive: pathname === '/leaderboard',
    },
    {
      href: '/shop',
      label: 'Loja',
      isActive: pathname === '/shop',
    },
  ]

  return (
    <>
      {routes.map((route) => (
        <Button
          asChild
          variant={route.isActive ? 'default' : 'ghost'}
          key={route.label}
          onClick={onClose}
        >
          <Link
            href={route.href}
            className="w-full rounded-md px-3 py-2 md:w-fit"
          >
            <span className="mr-auto">{route.label}</span>
          </Link>
        </Button>
      ))}
    </>
  )
}

export default NavLinks
