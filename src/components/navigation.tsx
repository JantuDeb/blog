import React from 'react'
import Link from 'next/link'
import { cn } from 'lib/utils'

type LinkType = {
    href: string
    label: string
    className?: string
}

interface NavigationBarProps {
    links: LinkType[]
}

export default function NavigationBar({ links }: NavigationBarProps) {
    return (
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.href}
                    className={cn(
                        'transition-colors hover:text-foreground/100 text-foreground/85 hover:underline',
                        link.className
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    )
}
