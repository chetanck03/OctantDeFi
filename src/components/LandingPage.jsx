import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'
import ContactForm from './ContactForm'
import FAQ from './FAQ'
import BlockchainCarousel from './BlockchainCarousel'

// Import all blockchain logos
import bitcoinLogo from '../assests/bitcoin-btc-logo.svg'
import ethereumLogo from '../assests/somnia.svg'
import solanaLogo from '../assests/solana-sol-logo.svg'
import polygonLogo from '../assests/polygon-matic-logo.svg'
import avalancheLogo from '../assests/avalanche-avax-logo.svg'
import cardanoLogo from '../assests/cardano-ada-logo.svg'
import polkadotLogo from '../assests/polkadot-new-dot-logo.svg'
import chainlinkLogo from '../assests/chainlink-link-logo.svg'
import algorandLogo from '../assests/algorand-algo-logo.svg'
import binanceLogo from '../assests/binance-coin-bnb-logo.svg'
import cosmosLogo from '../assests/cosmos-atom-logo.svg'
import fantomLogo from '../assests/fantom-ftm-logo.svg'
import nearLogo from '../assests/near-protocol-near-logo.svg'
import stellarLogo from '../assests/stellar-xlm-logo.svg'
import tezosLogo from '../assests/tezos-xtz-logo.svg'

import baseLogo from '../assests/base-logo.svg';
import sepoliaLogo from '../assests/sepolia-logo.svg';
import bnbLogo from '../assests/bnb-logo.svg';
import zetachainLogo from '../assests/zetachain-logo.svg';
import somniaLogo from '../assests/somnia.svg';
import citreaLogo from '../assests/citrea-logo.svg';
import liskLogo from '../assests/lisk-logo.svg';
function LandingPage() {
  const logoContainerRef = useRef(null)

  const benefits = [
    "Multi-wallet generation (BIP39/BIP44) — temporary or permanent wallets",
    "Import/export wallets using seed phrase or private key (cross-platform compatible)",
    "Multi-chain integration: Base Sepolia, Polygon Amoy, Ethereum Sepolia, BNB Smart Chain Testnet, ZetaChain, Citrea , Lisk and Somnia",
    "Smart contract escrow system with refund & claim flows for secure transactions",
    "QR code pay/scan/download + auto-detect scanner flow for easy address sharing",
    "Integrated faucet per network + transaction history with blockchain explorer links",
    "Manual gas limit & gas price control for advanced transaction management",
    "Revolutionary EVM shared seed technology for cross-chain compatibility",
    "Create unlimited addresses from single seed or generate fresh ones",
    "Advanced temporary wallet features for maximum privacy and testing",
    "Zero data collection - everything stays secure in your browser",
    "AI chatbot integration to help customers understand features and transaction workflows"
  ]

  // Lightweight hover effects only
  const handleLogoHover = (e, isEntering) => {
    const logo = e.currentTarget.closest('.crypto-logo')
    if (isEntering) {
      logo.classList.add('logo-hovered')
    } else {
      logo.classList.remove('logo-hovered')
    }
  }

  // Simple click handler
  const handleLogoClick = (e, logoName) => {
    const logo = e.currentTarget.closest('.crypto-logo')
    logo.classList.add('logo-clicked')
    setTimeout(() => logo.classList.remove('logo-clicked'), 200)
    console.log(`Clicked on ${logoName}`)
  }

  const blockchainLogos = [
    { src: liskLogo, name: 'Lisk', color: '#627eea' },
    { src: polygonLogo, name: 'Polygon', color: '#8247e5' },
    { src: baseLogo, name: 'Base', color: '#627eea' },
    { src: binanceLogo, name: 'Binance Coin', color: '#627eea' },
    { src: sepoliaLogo, name: 'Sepolia', color: '#627eea' },
    { src: bnbLogo, name: 'BNB Smart Chain', color: '#627eea' },
    { src: zetachainLogo, name: 'Zeta Chain', color: '#627eea' },
    { src: somniaLogo, name: 'Somina', color: '#627eea' },
    { src: citreaLogo, name: 'Citrea', color: '#627eea' },
    { src: bitcoinLogo, name: 'Bitcoin', color: '#f7931a' },
    { src: solanaLogo, name: 'Solana', color: '#9945ff' },
    { src: avalancheLogo, name: 'Avalanche', color: '#e84142' },
    { src: cardanoLogo, name: 'Cardano', color: '#0033ad' },
    { src: polkadotLogo, name: 'Polkadot', color: '#e6007a' },
    { src: chainlinkLogo, name: 'Chainlink', color: '#375bd2' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
      {/* Hero Section */}
      <div className="relative w-full bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <section className="relative z-1 mx-auto max-w-full">
          <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-30 sm:opacity-50 [perspective:200px]">
            <div className="absolute inset-0 [transform:rotateX(35deg)]">
              <div className="animate-grid [inset:0%_0px] [margin-left:-50%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_0)] sm:[background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:80px_80px] sm:[background-size:120px_120px] [background-repeat:repeat]"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent to-90%"></div>
          </div>

          <div className="z-10 mx-auto max-w-screen-xl gap-12 px-4 py-16 sm:py-20 md:py-28 text-gray-600 md:px-8">
            <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 text-center">
              <h1 className="font-geist group mx-auto w-fit rounded-2xl sm:rounded-3xl border-[2px] border-white/5 bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm text-gray-400">
                Secure Multi-Blockchain Wallet
                <ArrowRight className="ml-1 sm:ml-2 inline h-3 w-3 sm:h-4 sm:w-4 duration-300 group-hover:translate-x-1" />
              </h1>

              <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter text-transparent leading-tight">
                Simplify{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Crypto Access
                </span>
              </h2>

              <p className="mx-auto max-w-3xl text-xs sm:text-lg text-gray-300 leading-relaxed px-4">
                Easily create or import Hierarchical Deterministic (HD) wallets, manage multiple addresses from a single seed phrase, create secure escrow agreements, and interact with <span className='text-purple-400 font-semibold'>8 major blockchain networks</span> — all within a secure, non-custodial platform. Featuring <span className="text-purple-400 font-semibold">multi-chain support, QR code integration, smart contract escrow, and AI-powered customer assistance</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center  sm:gap-4 pt-4">
                {/* Primary Button with Spinning Border - Shows second on mobile, first on desktop */}
                <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] order-2 sm:order-1 mb-4 sm:mb-0">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
                    <Link
                      to="/dashboard"
                      className="group inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-8 sm:px-10 py-3 sm:py-4 text-center text-white transition-colors hover:bg-transparent/90 text-sm sm:text-base font-medium min-w-[160px] sm:min-w-[180px]"
                    >
                      Launch WalletX
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </span>

                {/* Secondary Button - Shows first on mobile, second on desktop */}
                <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] order-1 sm:order-2 mb-4 sm:mb-0">
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium transition-all duration-200 text-sm sm:text-base min-w-[160px] sm:min-w-[180px] bg-gray-950"
                  >
                    <span>Learn More</span>
                  </Link>
                </span>
              </div>
            </div>

            {/* Video Section replacing Dashboard Image Section */}
            <div className="mt-4 sm:mt-2 md:mt-16 px-4 sm:px-6 lg:px-8">
              <div className="relative max-w-7xl mx-auto">
                {/* Subtle glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-2xl"></div>

                {/* Video container */}
                <div className="relative">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl border border-neutral-700/30"
                    style={{
                      aspectRatio: 'auto'
                    }}
                  >
                    <source src="/wallet.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Blockchain Carousel Section */}
      <BlockchainCarousel />

      {/* Benefits Section */}
      <section className="relative py-20 bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-6">
                Professional{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  HD Wallet Platform
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Build and manage HD wallets with BIP39/BIP44 compliance across 8 blockchain networks including <span className='text-purple-500'>Base, Polygon, Ethereum, BNB Smart Chain, ZetaChain, Somnia, Citrea & Lisk</span>.
                Features include QR code scanning, smart contract escrow, faucet integration, manual gas controls, and AI-powered customer support - all in one comprehensive platform.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300 text-xm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Main container with dark theme */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 to-neutral-950/80 backdrop-blur-sm">
                {/* Subtle grid background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                </div>

                {/* Animated blockchain logos container */}
                <div ref={logoContainerRef} className="relative h-96 p-8 overflow-hidden">
                  {/* Animated connection lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    {blockchainLogos.map((_, index) => (
                      <line
                        key={`line-${index}`}
                        x1={`${20 + (index % 4) * 20}%`}
                        y1={`${20 + Math.floor(index / 4) * 25}%`}
                        x2={`${30 + ((index + 1) % 4) * 20}%`}
                        y2={`${30 + Math.floor((index + 1) / 4) * 25}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        className="animate-pulse"
                        style={{
                          animationDelay: `${index * 0.5}s`,
                          animationDuration: '3s'
                        }}
                      />
                    ))}
                  </svg>

                  {/* Optimized blockchain logos with minimal animations */}
                  {blockchainLogos.map((logo, index) => {
                    const positions = [
                      { x: 15, y: 20 }, { x: 45, y: 15 }, { x: 75, y: 25 },
                      { x: 20, y: 45 }, { x: 50, y: 40 }, { x: 80, y: 50 },
                      { x: 10, y: 70 }, { x: 40, y: 75 }, { x: 70, y: 65 },
                      { x: 25, y: 85 }, { x: 55, y: 80 }, { x: 85, y: 75 },
                      { x: 30, y: 30 }, { x: 60, y: 60 }, { x: 35, y: 55 }
                    ]
                    const pos = positions[index] || { x: 50, y: 50 }

                    return (
                      <div
                        key={logo.name}
                        className="absolute crypto-logo"
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          animation: `simple-float ${4 + (index % 3)}s ease-in-out infinite`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      >
                        <div
                          className="relative group cursor-pointer"
                          onClick={(e) => handleLogoClick(e, logo.name)}
                          onMouseEnter={(e) => handleLogoHover(e, true)}
                          onMouseLeave={(e) => handleLogoHover(e, false)}
                        >
                          {/* Simple logo container */}
                          <div
                            className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
                            style={{
                              backgroundColor: `${logo.color}10`,
                              borderColor: `${logo.color}40`
                            }}
                          >
                            <img
                              src={logo.src}
                              alt={logo.name}
                              className="w-7 h-7 md:w-8 md:h-8 object-contain"
                              title={logo.name}
                            />
                          </div>

                          {/* Simple tooltip */}
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-neutral-700">
                            {logo.name}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Minimal floating particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 2) * 40}%`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Central glow effect */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
                </div>

                {/* Bottom text */}
                <div className="px-8 pb-6">
                  <p className="text-center text-gray-400 text-sm">
                    Currently supporting 8 blockchain networks: Base, Polygon, Ethereum, BNB Smart Chain, ZetaChain, Somnia, Citrea, and Lisk - with more networks coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Form Section */}
      <ContactForm />

      {/* CTA Section */}
      <section className="relative py-20 bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Get Started?
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who trust WalletX for their cryptocurrency management needs.
          </p>

          {/* Primary Button with Spinning Border */}
          <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
              <Link
                to="/dashboard"
                className="group inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-10 py-4 text-center text-white transition-colors hover:bg-transparent/90 text-lg font-medium"
              >
                Start Using WalletX
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </span>
        </div>
      </section>
    </div>
  )
}

export default LandingPage