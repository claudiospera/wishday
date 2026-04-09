import Image from 'next/image'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tiffany-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image src="/logo.png" alt="Wishday" width={64} height={64} className="mx-auto rounded-2xl mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Sito in manutenzione
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          Stiamo lavorando per migliorare Wishday.
        </p>
        <p className="text-gray-400 text-sm">
          Torneremo online a breve. Grazie per la pazienza!
        </p>
      </div>
    </div>
  )
}
