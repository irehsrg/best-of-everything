'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import AuthForm from './auth-form'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div>
            <div className="text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {mode === 'signin'
                  ? 'Welcome back! Please sign in to your account.'
                  : 'Join Best Of Everything to vote on products.'
                }
              </p>
            </div>

            <div className="mt-5">
              <AuthForm
                mode={mode}
                onToggle={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                onSuccess={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}