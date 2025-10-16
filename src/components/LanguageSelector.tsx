'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown } from 'lucide-react'

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export default function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  // Prevent hydration mismatch by only accessing localStorage on client
  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage && ['en', 'pt', 'es'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [i18n])

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    if (isClient) {
      localStorage.setItem('selectedLanguage', languageCode)
    }
    setIsOpen(false)
  }

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="relative">
        <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
          <Globe className="h-4 w-4" />
          <span className="text-lg">🇺🇸</span>
          <span className="hidden sm:block">English</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        aria-label="Change Language"
      >
        <Globe className="h-4 w-4" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:block">{currentLanguage.name}</span>
        <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10 bg-black bg-opacity-25 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-1 w-48 sm:w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100 sm:hidden">
                {t('language.changeLanguage')}
              </div>
              
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-3 ${
                    language.code === currentLanguage.code 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="flex-1">{language.name}</span>
                  {language.code === currentLanguage.code && (
                    <span className="text-blue-600 text-xs">✓</span>
                  )}
                </button>
              ))}
              
              <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100 sm:hidden">
                {t('language.changeLanguage')}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
