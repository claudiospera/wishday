import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Wishday — Link',
  description: 'Esprimi un desiderio. Realizzalo insieme.',
}

const links = [
  {
    label: 'Crea la tua lista',
    href: '/dashboard',
    external: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    primary: true,
  },
  {
    label: 'Scopri Wishday',
    href: '/',
    external: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    primary: false,
  },
  {
    label: 'Seguici su Instagram',
    href: 'https://www.instagram.com/wishday.it/',
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    primary: false,
  },
  {
    label: 'Seguici su Facebook',
    href: 'https://www.facebook.com/share/1DnXWXi6PJ/?mibextid=wwXIfr',
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    primary: false,
  },
]

export default function LinkPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-tiffany-50 to-white flex flex-col items-center justify-center px-5 py-16">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Wishday"
          width={220}
          height={220}
          priority
          className="object-contain"
        />
      </div>

      {/* Payoff */}
      <p className="text-gray-500 text-base text-center mb-10 max-w-xs leading-snug">
        Esprimi un desiderio. Realizzalo insieme.
      </p>

      {/* Links */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`flex items-center justify-center gap-3 w-full rounded-full py-4 px-6 text-base font-semibold transition-all duration-200 shadow-sm active:scale-95 ${
              link.primary
                ? 'bg-tiffany-400 text-white hover:bg-tiffany-500 shadow-tiffany-200 shadow-md'
                : 'bg-white text-tiffany-700 border border-tiffany-200 hover:bg-tiffany-50'
            }`}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-14 text-xs text-gray-400">© {new Date().getFullYear()} Wishday</p>
    </main>
  )
}
