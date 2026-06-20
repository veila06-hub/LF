import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import PageTransition from '../PageTransition'
import ThemeCustomizer from '../ui/ThemeCustomizer'

export default function Layout() {
  const location = useLocation()
  const [customizerOpen, setCustomizerOpen] = useState(false)

  return (
    <div className="app-bg aurora flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onOpenCustomizer={() => setCustomizerOpen(true)} />
        <main className="flex-1 overflow-x-hidden px-4 pb-24 pt-6 md:px-8 md:pb-8">
          <div className="mx-auto w-full max-w-7xl">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <MobileNav onOpenCustomizer={() => setCustomizerOpen(true)} />
      <ThemeCustomizer open={customizerOpen} onClose={() => setCustomizerOpen(false)} />
    </div>
  )
}
