import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-tiffany-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Wishday" width={36} height={36} className="rounded" />
          <span className="font-bold text-xl text-tiffany-700">Wishday</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="#come-funziona" className="hover:text-tiffany-700 transition-colors">
            Come funziona
          </Link>
          <Link href="/pricing" className="hover:text-tiffany-700 transition-colors">
            Prezzi
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <div id="google_translate_element" />
          <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Accedi
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: 'sm' }), 'bg-tiffany-700 hover:bg-tiffany-800 text-white')}>
            Inizia gratis
          </Link>
        </div>
      </div>
    </header>
  )
}
