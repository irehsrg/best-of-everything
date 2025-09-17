'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Plus, Menu, X, User, LogOut } from 'lucide-react'
import AuthModal from './auth-modal'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onAddProduct?: () => void
}

export default function Header({ onAddProduct }: HeaderProps) {
  const { user, profile, signOut, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleAddProductClick = () => {
    if (!user) {
      handleAuthClick('signin')
    } else {
      onAddProduct?.()
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Best Of Everything
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={handleAddProductClick}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>

              {loading ? (
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="text-sm">
                      {profile?.display_name || user.email?.split('@')[0]}
                    </span>
                  </Button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-50 border border-border">
                      <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                        {user.email}
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthClick('signin')}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-border py-4">
              <div className="space-y-3">
                <Button
                  onClick={handleAddProductClick}
                  className="w-full justify-start gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>

                {loading ? (
                  <div className="px-4 py-2">
                    <div className="w-full h-8 bg-muted rounded animate-pulse" />
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                      Signed in as {user.email}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-muted rounded"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted rounded"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleAuthClick('signin')}
                      className="w-full justify-start"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => handleAuthClick('signup')}
                      className="w-full justify-start"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  )
}