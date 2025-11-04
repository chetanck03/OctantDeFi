import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Wallet, FileText } from 'lucide-react'


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Add custom scrollbar styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .mobile-menu-scroll {
        scrollbar-width: thin;
        scrollbar-color: #525252 #262626;
      }
      
      .mobile-menu-scroll::-webkit-scrollbar {
        width: 6px;
      }
      
      .mobile-menu-scroll::-webkit-scrollbar-track {
        background: #262626;
        border-radius: 3px;
      }
      
      .mobile-menu-scroll::-webkit-scrollbar-thumb {
        background: #525252;
        border-radius: 3px;
      }
      
      .mobile-menu-scroll::-webkit-scrollbar-thumb:hover {
        background: #737373;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()



  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Disable body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      // Re-enable body scroll when mobile menu is closed
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    // Cleanup function to ensure scroll is re-enabled
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isMenuOpen])







  const handleHomeClick = () => {
    setIsMenuOpen(false)

    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation to complete, then scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } else {
      // If we're already on home page, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFAQClick = () => {
    setIsMenuOpen(false)

    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const faqSection = document.getElementById('faq')
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      // If we're already on home page, just scroll
      const faqSection = document.getElementById('faq')
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleHDWalletsClick = () => {
    setIsMenuOpen(false)
    // Set EVM blockchain selection and navigate to dashboard
    localStorage.setItem('selected_blockchain', 'evm')
    navigate('/dashboard')
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('blockchainChanged', { detail: 'evm' }))
  }

  const handleWhitepaperClick = () => {
    // You can replace this URL with your actual whitepaper link
    window.open('/whitepaper.pdf', '_blank')
    setIsMenuOpen(false)
  }



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.25,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
        ease: 'easeInOut',
        staggerChildren: 0.05,
      },
    },
  }

  const mobileItemVariants = {
    closed: {
      opacity: 0,
      x: 15,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${isScrolled
          ? 'border-neutral-700/30 bg-neutral-950/80 border-b shadow-lg backdrop-blur-xl'
          : 'bg-neutral-950/20 backdrop-blur-sm'
          }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto  px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <button onClick={handleHomeClick} className="flex cursor-pointer items-center space-x-2 text-white hover:text-blue-400 transition-colors">
                {/* <img
                  src={Logo}
                  alt="Blockchain Logo"
                  className="h-8 w-8"
                /> */}
                <Wallet className="h-8 w-8 text-purple-500 " />

                <span className="text-xl font-geist bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  WalletX
                </span>
              </button>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <motion.div
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem('home')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={handleHomeClick}
                  className="text-gray-300 hover:text-white relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {hoveredItem === 'home' && (
                    <motion.div
                      className="bg-neutral-800/50 absolute inset-0 rounded-lg"
                      layoutId="navbar-hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">Home</span>
                </button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem('about')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {hoveredItem === 'about' && (
                    <motion.div
                      className="bg-neutral-800/50 absolute inset-0 rounded-lg"
                      layoutId="navbar-hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">About</span>
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem('faq')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={handleFAQClick}
                  className="text-gray-300 hover:text-white relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {hoveredItem === 'faq' && (
                    <motion.div
                      className="bg-neutral-800/50 absolute inset-0 rounded-lg"
                      layoutId="navbar-hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">FAQ</span>
                </button>
              </motion.div>

              {/* HD Wallets Navigation */}
              <motion.div
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem('hd-wallets')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={handleHDWalletsClick}
                  className="text-gray-300 hover:text-white relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  {hoveredItem === 'hd-wallets' && (
                    <motion.div
                      className="bg-neutral-800/50 absolute inset-0 rounded-lg"
                      layoutId="navbar-hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Wallet className="h-4 w-4" />
                  <span className="relative z-10">HD Wallets</span>
                </button>
              </motion.div>

              {/* Whitepaper Navigation */}
              <motion.div
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem('whitepaper')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={handleWhitepaperClick}
                  className="text-gray-300 hover:text-white relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  {hoveredItem === 'whitepaper' && (
                    <motion.div
                      className="bg-neutral-800/50 absolute inset-0 rounded-lg"
                      layoutId="navbar-hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <FileText className="h-4 w-4" />
                  <span className="relative z-10">Whitepaper</span>
                </button>
              </motion.div>




            </nav>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors"
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="border-neutral-700/50 bg-neutral-950/95 backdrop-blur-md fixed top-16 right-4 bottom-4 z-50 w-80 overflow-y-auto overflow-x-hidden rounded-2xl border shadow-xl md:hidden mobile-menu-scroll"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="space-y-6 p-6 pb-8">
                <div className="space-y-1">
                  <motion.div variants={mobileItemVariants}>
                    <button
                      onClick={handleHomeClick}
                      className="text-gray-300 hover:text-white hover:bg-neutral-800/50 block w-full text-left rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                    >
                      Home
                    </button>
                  </motion.div>
                  <motion.div variants={mobileItemVariants}>
                    <Link
                      to="/about"
                      className="text-gray-300 hover:text-white hover:bg-neutral-800/50 block rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                  </motion.div>
                  <motion.div variants={mobileItemVariants}>
                    <button
                      onClick={handleFAQClick}
                      className="text-gray-300 hover:text-white hover:bg-neutral-800/50 block w-full text-left rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                    >
                      FAQ
                    </button>
                  </motion.div>
                </div>

                  <motion.div variants={mobileItemVariants}>
                    <button
                      onClick={handleHDWalletsClick}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 w-full rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                    >
                      <Wallet className="h-5 w-5" />
                      <span>HD Wallets</span>
                    </button>
                  </motion.div>

                <motion.div
                  className="border-neutral-700 border-t pt-6 space-y-2"
                  variants={mobileItemVariants}
                >
                  <button
                    onClick={handleWhitepaperClick}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 w-full rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                    title="View Whitepaper"
                  >
                    <div className="p-1 border border-gray-600 rounded-full">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span>Whitepaper</span>
                  </button>
                </motion.div>


              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar