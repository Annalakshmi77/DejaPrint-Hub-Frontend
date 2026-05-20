import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { NAV_ITEMS } from '@/utils/constants'
import { cn } from '@/utils/helpers'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b py-2 shadow-sm"
          : "bg-transparent py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20"
            >
              <span className="text-xl font-black text-primary-foreground">P</span>
            </motion.div>
            <span className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">
              Print<span className="text-primary">Craft</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex md:items-center md:gap-2 bg-muted/20 p-1 rounded-full border border-white/10">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "relative rounded-full px-5 py-2 text-sm font-bold transition-all hover:text-primary",
                    location.pathname === item.href
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-background -z-10 shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {user && (
              <>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary transition-colors" asChild>
                  <Link to="/products">
                    <Search className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/5 hover:text-primary transition-colors" asChild>
                  <Link to="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-lg shadow-primary/30">
                      2
                    </span>
                  </Link>
                </Button>
                <div className="h-8 w-[1px] bg-muted mx-2" />
              </>
            )}

            {user ? (
              <Button variant="outline" className="rounded-full border-2 font-bold px-6 hover:bg-primary hover:text-white hover:border-primary transition-all" asChild>
                <Link to="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  My Account
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="rounded-full font-bold px-6 hover:text-primary transition-colors" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button className="rounded-full font-bold px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t mt-2 rounded-2xl shadow-2xl"
            >
              <nav className="flex flex-col gap-2 p-6">
                {user && NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-4 text-lg font-bold transition-all",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                ))}
                <div className="mt-6 flex flex-col gap-3 border-t pt-6">
                  {user ? (
                    <Button size="lg" className="rounded-xl w-full font-bold" asChild>
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        Go to Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="lg" className="rounded-xl w-full font-bold border-2" asChild>
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button size="lg" className="rounded-xl w-full font-bold shadow-lg" asChild>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export default Header
