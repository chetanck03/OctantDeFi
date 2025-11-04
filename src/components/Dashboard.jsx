import React, { useState, useEffect } from 'react'
import {
  ArrowRight,
  CheckCircle,
  Link
} from 'lucide-react'

import WalletComponent from './Wallet/Wallet'

// Import blockchain logos
import polygonLogo from '../assests/polygon-matic-logo.svg'
import baseLogo from '../assests/base-logo.svg'
import sepoliaLogo from '../assests/sepolia-logo.svg'
import bnbLogo from '../assests/bnb-logo.svg'
import zetachainLogo from '../assests/zetachain-logo.svg'
import somniaLogo from '../assests/somnia.svg'
import liskLogo from '../assests/lisk-logo.svg'
import citreaLogo from '../assests/citrea-logo.svg'

function Dashboard() {
  const [selectedBlockchain, setSelectedBlockchain] = useState(null)

  useEffect(() => {
    const savedBlockchain = localStorage.getItem('selected_blockchain')
    if (savedBlockchain) {
      setSelectedBlockchain(savedBlockchain)
    }

    const handleBlockchainChange = (event) => {
      setSelectedBlockchain(event.detail)
    }

    window.addEventListener('blockchainChanged', handleBlockchainChange)

    return () => {
      window.removeEventListener('blockchainChanged', handleBlockchainChange)
    }
  }, [])

  // Single EVM blockchain entry point
  const evmBlockchain = {
    id: 'evm',
    name: 'EVM Compatible Blockchains',
    description: 'Access multiple blockchain networks with unified wallet functionality',
    color: 'from-blue-500 to-purple-600',
    networks: [
      { name: 'Base Sepolia Testnet', logo: baseLogo, color: 'from-blue-500 to-blue-600' },
      { name: 'Polygon Amoy Testnet', logo: polygonLogo, color: 'from-purple-500 to-purple-600' },
      { name: 'Ethereum Sepolia Testnet', logo: sepoliaLogo, color: 'from-gray-500 to-gray-600' },
      { name: 'BNB Smart Chain Testnet', logo: bnbLogo, color: 'from-yellow-500 to-yellow-600' },
      { name: 'Somnia Testnet', logo: somniaLogo, color: 'from-pink-500 to-pink-600' },
      { name: 'ZetaChain Testnet', logo: zetachainLogo, color: 'from-green-500 to-green-600' },
      { name: 'Lisk Sepolia Testnet', logo: liskLogo, color: 'from-blue-400 to-blue-700' },
      { name: 'Citrea Testnet', logo: citreaLogo, color: 'from-orange-500 to-yellow-600' }
    ],
    logos: [polygonLogo, baseLogo, sepoliaLogo, bnbLogo, zetachainLogo, somniaLogo, liskLogo, citreaLogo]
  }

  if (selectedBlockchain && selectedBlockchain === 'evm') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black relative">
        {/* Background Effects */}
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        <div className="relative z-10">
          <WalletComponent blockchain="base" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
      <div className="relative w-full bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-30 sm:opacity-50 [perspective:200px]">
          <div className="absolute inset-0 [transform:rotateX(35deg)]">
            <div className="animate-grid [inset:0%_0px] [margin-left:-50%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_0)] sm:[background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:80px_80px] sm:[background-size:120px_120px] [background-repeat:repeat]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent to-90%" />
        </div>


      </div>

      {/* Blockchain Selection Section */}
      <section className="relative py-20 bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-geist text-2xl sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
              EVM Compatible{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Wallet Platform
              </span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4 sm:px-0">
              Create, import, and manage wallets across multiple EVM-compatible blockchain networks with unified functionality.
            </p>

            {/* EVM Info */}
            <div className="max-w-4xl mt-8 mx-auto bg-gradient-to-r from-purple-600/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <div className="flex items-center gap-2 text-purple-400 mt-1 flex-shrink-0">
                  <Link className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-semibold text-sm sm:text-base">EVM Blockchain Support</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    WalletX supports <strong className="text-white">8 major EVM-compatible networks</strong> including <span className='text-purple-400'>Polygon, Base, Ethereum Sepolia, BNB Smart Chain, ZetaChain, Somnia, Avalanche, and Arbitrum.</span>
                    <strong className="text-white"> Create temporary or permanent wallets, import existing ones, and switch between networks seamlessly</strong> with the same interface and functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            <div
              onClick={() => {
                setSelectedBlockchain('evm')
                localStorage.setItem('selected_blockchain', 'evm')
              }}
              className="group cursor-pointer relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 sm:p-8 hover:border-neutral-600 transition-all duration-200 group-hover:scale-105 h-full flex flex-col min-h-[500px]">
                <div className="text-center flex-1 flex flex-col">
                  {/* EVM Compatibility Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-purple-600/20 to-purple-400/20 border border-purple-500/30 rounded-full px-2 py-1">
                    <Link className="h-3 w-3 text-purple-400" />
                    <span className="text-xs text-purple-400 font-medium">EVM</span>
                  </div>

                  {/* Central Logo Display */}
                
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{evmBlockchain.name}</h3>
                  <p className="text-gray-400 mb-6 flex-grow">{evmBlockchain.description}</p>
                  
                  {/* Enhanced Network Grid - Responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                    {evmBlockchain.networks.map((network, index) => (
                      <div key={index} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                        <div className="relative bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-lg p-3 hover:border-neutral-600/50 transition-all duration-200 ">
                          <div className="flex items-center space-x-3 ">
                            <div className="flex-shrink-0 ">
                              <div className="relative w-10 h-10 rounded-full p-1.5 flex items-center justify-center">
                                <img src={network.logo} alt={network.name} className="w-full h-full object-contain" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                <span className="text-base text-gray-300 font-medium truncate">
                                  {network.name.replace(' Testnet', '')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto">
                    <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] w-full cursor-pointer">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
                        <div className="w-full inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-6 py-3 text-white font-medium transition-colors hover:bg-transparent/90">
                          <span>Access EVM Wallets</span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
