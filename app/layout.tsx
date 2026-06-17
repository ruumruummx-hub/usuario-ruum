import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ruum Ruum Usuario | By MoviliaX',
  description: 'Tecnología para mover vehículos con confianza.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen md:flex md:items-center md:justify-center md:p-4">
        {children}
      </body>
    </html>
  )
}
