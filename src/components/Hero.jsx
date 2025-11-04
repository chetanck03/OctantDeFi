import React from 'react'
import Wallet from './Wallet/Wallet'

function Hero() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 px-4 sm:px-0">
            WalletX
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
            Your secure, multi-blockchain wallet manager supporting 8 major networks. Generate, store, and manage your crypto wallets with advanced escrow functionality, QR code integration, and AI assistance.
          </p>
        </div>
        <Wallet />
      </div>
    </div>
  )
}

export default Hero