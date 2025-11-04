import React from 'react'
import {
  Shield, Users, Code, Wallet, ArrowRight, CheckCircle, Key, Network,
  History, Coins, Eye, RefreshCw, ExternalLink, Layers, GitBranch,
  Database, Server, Cpu, Fingerprint, ShieldCheck, Globe2, Sparkles,
  Zap, Lock, Timer, Shuffle, Target, TrendingUp
} from 'lucide-react'

function AboutPage() {
  const benefits = [
    "Multi-wallet generation (BIP39/BIP44) — temporary or permanent wallets",
    "Import/export wallets using seed phrase or private key (cross-platform compatible)",
    "Multi-chain integration: Base Sepolia, Polygon Amoy, Ethereum Sepolia, BNB Smart Chain Testnet, ZetaChain, Somnia, Lisk Sepolia, and Citera Testnet",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
      {/* Hero Section with Grid Background */}
      <div className="relative w-full bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-30 sm:opacity-50 [perspective:200px]">
          <div className="absolute inset-0 [transform:rotateX(35deg)]">
            <div className="animate-grid [inset:0%_0px] [margin-left:-50%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_0)] sm:[background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:80px_80px] sm:[background-size:120px_120px] [background-repeat:repeat]"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent to-90%"></div>
        </div>

        <section className="relative z-10 py-20 pt-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-5xl mx-auto">


              <h1 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-4xl md:text-5xl lg:text-6xl tracking-tighter text-transparent leading-tight mb-6">
                About{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  WalletX
                </span>
              </h1>

              <p className="text-sm md:text-lg text-gray-300 mb-6 leading-relaxed max-w-4xl mx-auto">
                WalletX revolutionizes cryptocurrency access with advanced multi-wallet technology, currently supporting
                <span className="text-purple-400 font-semibold"> 8 major blockchain networks</span> including <span className="text-purple-400 font-semibold">  Base, Polygon, Ethereum, BNB Smart Chain, ZetaChain, Somnia, Lisk, and Citera</span>.
                Like temporary phone numbers or disposable emails, but for crypto - offering professional-grade
                HD wallet generation, revolutionary EVM shared seed technology, complete transaction management, QR code integration, and secure escrow functionality.
              </p>

              <p className="text-sm md:text-lg text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto">
                Supporting <span className="text-purple-400 font-semibold">8 blockchain networks</span> with comprehensive features including <span className="text-purple-400 font-semibold">smart contract escrow, QR code integration, faucet access, and AI-powered assistance</span> -
                perfect for testing, development, privacy-focused transactions, secure escrow agreements, or when you need instant blockchain access
                without compromising your main wallets. Built with enterprise-level security and zero data collection.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base mb-8">
                <div className="flex items-center space-x-2 text-blue-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold">Open Source</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <Shield className="h-4 w-4" />
                  <span className="font-semibold">Non-Custodial</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-400">
                  <Timer className="h-4 w-4" />
                  <span className="font-semibold">Temporary Wallets</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>




      {/* Mission & Benefits Section */}
      <section className="py-20 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl tracking-tighter text-transparent leading-tight mb-6">
                The Future of{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Temporary Wallets
                </span>
              </h2>
              <p className="text-sm md:text-lg text-gray-300 mb-6 leading-relaxed">
                In the digital age, we use temporary phone numbers for privacy, disposable emails for security,
                and burner accounts for anonymity. WalletX brings this revolutionary concept to cryptocurrency with
                professional-grade temporary wallets, supporting <span className="text-purple-400 font-semibold">8 major blockchain networks</span> including Base, Polygon, Ethereum, BNB Smart Chain, ZetaChain, Somnia, Lisk, and Citera
                that don't compromise on features or security.
              </p>
              <p className="text-sm md:text-lg text-gray-300 mb-6 leading-relaxed">
                Our groundbreaking <span className="text-purple-400 font-semibold">EVM Shared Seed technology</span> enables
                one seed phrase to generate compatible wallet addresses across all 8 supported EVM-compatible networks.
                Whether you're a developer testing dApps, a privacy-conscious user making anonymous
                transactions, someone who needs secure escrow agreements, or instant blockchain access, WalletX provides the perfect solution.
              </p>
              <p className="text-sm md:text-lg text-gray-300 mb-8 leading-relaxed">
                Built with enterprise-level security, industry-standard BIP39/BIP44 cryptographic methods, integrated escrow system for secure fund transfers, QR code functionality for seamless transactions, AI-powered customer assistance, and zero data collection,
                WalletX bridges the gap between temporary convenience and professional multi-chain functionality.
                Experience comprehensive crypto wallet management across 8 blockchain networks today.
              </p>


            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm md:text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-neutral-950/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-6">
                Perfect{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Use Cases
                </span>
              </h2>
              <p className="text-sm md:text-lg text-gray-300 mb-8 leading-relaxed">
                Temporary wallets aren't just a convenience - they're a powerful tool for modern cryptocurrency users.
                Whether you're a developer building the next big dApp, a privacy-conscious individual, or someone who
                needs quick blockchain access, WalletX provides the perfect solution for every scenario.
              </p>

              <div className="text-left space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Target className="h-6 w-6 text-blue-500 mr-3" />
                    Development & Testing
                  </h3>
                  <p className="text-gray-400  text-sm md:text-lg leading-relaxed ml-9">
                    Create isolated wallets for dApp testing, smart contract interactions, and blockchain development
                    without risking your main funds. Perfect for developers who need clean testing environments.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Lock className="h-6 w-6 text-green-500 mr-3" />
                    Secure Escrow System
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    Built-in smart contract escrow system enables secure fund transfers between parties. Create escrow agreements
                    with automatic fund release conditions, dispute resolution mechanisms, and complete transaction transparency.
                    Perfect for freelance payments, marketplace transactions, or any situation requiring trusted fund management.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Lock className="h-6 w-6 text-green-500 mr-3" />
                    QR Code Integration
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    Comprehensive QR code functionality for seamless transactions. Display wallet addresses as QR codes for easy sharing,
                    scan QR codes to auto-populate recipient addresses, and download QR codes for offline use. Auto-detect scanner flow
                    reduces manual errors and improves user experience across all transaction types.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Sparkles className="h-6 w-6 text-blue-500 mr-3" />
                    AI-Powered Assistance
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    Built-in AI chatbot provides instant help for understanding features and navigating transaction workflows.
                    Get step-by-step guidance for wallet creation, escrow processes, network switching, and security best practices.
                    Perfect for both beginners learning crypto and experts needing quick feature explanations.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Zap className="h-6 w-6 text-purple-500 mr-3" />
                    Quick Access
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    Instant wallet creation for airdrops, token claims, DeFi interactions, or any situation requiring
                    immediate blockchain access. No setup time, no complicated processes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <TrendingUp className="h-6 w-6 text-orange-500 mr-3" />
                    Portfolio Separation
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    Separate different investment strategies, trading activities, or business transactions with
                    dedicated temporary wallets. Organize your crypto activities with precision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section className="relative py-20 bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-6">
                Security{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  First
                </span>
              </h2>
              <p className="text-sm md:text-lg text-gray-300 mb-8 leading-relaxed">
                Security isn't an afterthought - it's the foundation of everything we build. WalletX employs
                enterprise-grade security measures with complete client-side cryptographic operations, ensuring
                your private keys never leave your browser and your financial privacy remains intact.
              </p>

              <div className="text-left space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <ShieldCheck className="h-6 w-6 text-green-400 mr-3" />
                    Smart Contract Escrow
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    Secure escrow system powered by audited smart contracts on Somnia Blockchain. Funds are held in
                    transparent, immutable contracts with automatic release conditions and dispute resolution mechanisms.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <ShieldCheck className="h-6 w-6 text-green-400 mr-3" />
                    Client-Side Security
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    Your private keys never leave your browser. All cryptographic operations happen locally using
                    industry-standard libraries like ethers.js and @solana/web3.js, ensuring maximum security.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Fingerprint className="h-6 w-6 text-blue-400 mr-3" />
                    BIP Standard Compliance
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    Full BIP-39 mnemonic generation and BIP-44 hierarchical derivation ensure compatibility with
                    MetaMask, Phantom, and other standard wallets. Your wallets work everywhere.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Eye className="h-6 w-6 text-purple-400 mr-3" />
                    Privacy Controls
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    Advanced privacy controls let you hide/show private keys and seed phrases with secure display
                    controls. Copy-to-clipboard functionality with automatic clearing enhances security.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Database className="h-6 w-6 text-orange-400 mr-3" />
                    Local Storage Only
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9">
                    All wallet data is stored locally in your browser. No server-side storage, no data collection,
                    no tracking - your financial privacy is guaranteed and protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture Section */}
      <section className="py-20 bg-neutral-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-6">
                Technical{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Architecture
                </span>
              </h2>
              <p className="text-sm md:text-lg text-gray-300 mb-8 leading-relaxed">
                WalletX is built on a foundation of modern web technologies and industry-standard blockchain libraries.
                Our architecture prioritizes performance, security, and compatibility while maintaining the flexibility
                to support 8 blockchain networks seamlessly. Integrated with comprehensive multi-chain support including smart contract escrow, QR code functionality, and AI-powered assistance.
              </p>

              <div className="text-left space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Cpu className="h-6 w-6 text-blue-500 mr-3" />
                    Multi-Chain Architecture
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9 mb-2">
                    Built to support 8 major blockchain networks: Base Sepolia, Polygon Amoy, Ethereum Sepolia, BNB Smart Chain Testnet, ZetaChain Testnet, Somnia Testnet, Lisk Sepolia, and Citera Testnet.
                    Each network features integrated faucets, transaction history with explorer links, and comprehensive wallet functionality.
                  </p>
                  <div className="text-sm text-blue-400 font-mono ml-9">8 Networks, Unified Interface, Cross-Chain Compatible</div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Server className="h-6 w-6 text-purple-500 mr-3" />
                    Smart Contract Escrow & QR Integration
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9 mb-2">
                    Advanced smart contract escrow system with refund & claim flows deployed across supported networks.
                    Integrated QR code functionality for address sharing and scanning, plus AI chatbot assistance for seamless user experience.
                    Automated fund management with transparent transaction tracking.
                  </p>
                  <div className="text-sm text-blue-400 font-mono ml-9">Solidity, QR Integration, AI Assistant, Escrow Patterns</div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Server className="h-6 w-6 text-purple-500 mr-3" />
                    EVM Compatibility
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9 mb-2">
                    Full EVM compatibility with ethers.js v6.15.0 for robust blockchain interaction. Support for EIP-155 chain IDs,
                    EIP-1559 gas fees, and seamless MetaMask compatibility across all EVM-compatible networks.
                  </p>
                  <div className="text-sm text-blue-400 font-mono ml-9">ethers.js, JSON-RPC, EIP standards</div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <GitBranch className="h-6 w-6 text-green-500 mr-3" />
                    HD Key Derivation
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9 mb-2">
                    Secure hierarchical deterministic key generation using bip39 and ed25519-hd-key libraries.
                    Standard derivation paths ensure maximum compatibility with existing wallet infrastructure.
                  </p>
                  <div className="text-sm text-blue-400 font-mono ml-9">BIP-39, BIP-44, ed25519-hd-key</div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Globe2 className="h-6 w-6 text-orange-500 mr-3" />
                    Modern Web Stack
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed ml-9 mb-2">
                    Built with React 19, Vite, and TailwindCSS for optimal performance and developer experience.
                    Optimized bundle with crypto polyfills ensures seamless browser compatibility across all platforms.
                  </p>
                  <div className="text-sm text-blue-400 font-mono ml-9">React 19, Vite, TailwindCSS, Polyfills</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source & Community Section */}
      <section className="relative py-20 bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-6">
              Open Source{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                & Community
              </span>
            </h2>

            <p className="text-sm md:text-lg text-gray-300 mb-6 leading-relaxed">
              WalletX is completely open source and transparent. Every line of code is auditable,
              ensuring you can verify our security claims and privacy commitments. We believe in
              building trust through transparency, not through obscurity.
            </p>

            <p className="text-sm md:text-lg text-gray-300 mb-8 leading-relaxed">
              Our mission is to democratize access to professional-grade cryptocurrency tools while
              maintaining the highest security standards. We welcome contributions from developers
              worldwide who share our vision of making crypto more accessible and secure.
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-8 text-center">
              <div className="flex flex-col items-center">
                <GitBranch className="h-8 w-8 text-green-400 mb-2" />
                <h4 className="text-white font-semibold mb-1">Open Source</h4>
                <p className="text-gray-400 text-sm">MIT Licensed</p>
              </div>

              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-purple-400 mb-2" />
                <h4 className="text-white font-semibold mb-1">Auditable</h4>
                <p className="text-gray-400 text-sm">Transparent Code</p>
              </div>
            </div>
{/* 
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="https://github.com/chetanck03/SominaWalletX" target="_blank"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="#"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Documentation</span>
              </a>

            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Get Started?
            </span>
          </h2>
          <p className="text-sm md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the revolution in cryptocurrency access. Create your first temporary wallet in seconds
            and experience the perfect blend of convenience, security, and professional features.
          </p>

          {/* Primary Button with Spinning Border */}
          <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
              <a
                href="/dashboard"
                className="group inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-10 py-4 text-center text-white transition-colors hover:bg-transparent/90 text-lg font-medium"
              >
                Launch WalletX
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </span>
        </div>
      </section>
    </div>
  )
}

export default AboutPage