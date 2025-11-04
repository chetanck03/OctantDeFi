import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Which blockchain networks does WalletX currently support?",
      answer: "WalletX currently supports 8 major blockchain networks: Base Sepolia, Polygon Amoy, Ethereum Sepolia, BNB Smart Chain Testnet, ZetaChain Testnet, Somnia Testnet, Lisk Sepolia, and Citera Testnet. All networks feature integrated faucets, transaction history with explorer links, and full wallet functionality including HD wallet generation, seed phrase import/export, and smart contract escrow capabilities."
    },
    {
      question: "What makes WalletX's multi-wallet generation unique?",
      answer: "WalletX offers revolutionary multi-wallet generation supporting both temporary and permanent wallets using BIP39/BIP44 standards. You can create unlimited addresses from a single seed phrase or generate fresh wallets as needed. Our EVM shared seed technology ensures cross-platform compatibility, allowing you to import/export wallets using seed phrases or private keys across different wallet applications."
    },
    {
      question: "How does the QR code functionality work?",
      answer: "WalletX includes comprehensive QR code integration for seamless transactions. You can display your wallet address as a QR code for easy sharing, scan QR codes to auto-populate recipient addresses in transactions, and download QR codes for offline sharing. The auto-detect scanner flow works across both regular EVM transactions and escrow agreements, reducing manual errors and improving user experience."
    },
    {
      question: "What is the smart contract escrow system and how secure is it?",
      answer: "WalletX features a built-in smart contract escrow system that enables secure fund transfers between parties with refund & claim flows. Funds are held in transparent, audited smart contracts with automatic release conditions and complete transaction transparency. The system includes timeout and refund protocols, allowing senders to recover funds from unclaimed escrows, making it perfect for freelance payments, marketplace transactions, or any situation requiring trusted fund management."
    },
    {
      question: "How do the integrated faucets work?",
      answer: "Each supported network includes integrated testnet faucets that provide free development tokens for testing and experimentation. You can easily request test tokens directly from the wallet interface without visiting external faucet websites. This makes WalletX perfect for developers testing dApps, learning blockchain development, or trying escrow features risk-free across all 8 supported networks."
    },
    {
      question: "What advanced transaction controls are available?",
      answer: "WalletX provides manual gas limit and gas price control for advanced transaction management. You can customize transaction fees, set appropriate gas limits for complex smart contract interactions, monitor transaction status in real-time, and view complete transaction history with blockchain explorer integration. All transactions include detailed confirmations and status tracking."
    },
    {
      question: "How does the AI chatbot assistance work?",
      answer: "WalletX includes AI-powered customer assistance to help users understand all features and navigate transaction workflows. The AI chatbot can explain wallet management concepts, guide you through escrow creation, help troubleshoot transaction issues, and provide step-by-step instructions for any wallet operation. This ensures both beginners and advanced users can maximize the platform's capabilities."
    },
    {
      question: "What are temporary wallets and when should I use them?",
      answer: "Temporary wallets are like disposable phone numbers for cryptocurrency - perfect for testing, development, privacy-focused transactions, escrow agreements, airdrops, or when you need instant blockchain access without compromising your main wallets. You can generate unlimited HD wallets from a single seed phrase or create fresh ones as needed, providing maximum privacy and security for specific use cases."
    },
    {
      question: "How secure is WalletX and where are my private keys stored?",
      answer: "WalletX employs enterprise-grade security with complete client-side cryptographic operations. Your private keys never leave your browser and are stored locally with encryption. We use industry-standard BIP-39/BIP-44 compliance, Web Crypto API for secure random generation, and maintain a zero data collection policy. All cryptographic operations happen locally using ethers.js and secure smart contract interactions."
    },
    {
      question: "Can I import existing wallets from MetaMask, Trust Wallet, or other wallets?",
      answer: "Yes! WalletX supports importing existing wallets using 12 or 24-word mnemonic phrases with full BIP-39 validation and cross-platform compatibility. Since we use standard derivation paths, wallets imported from MetaMask, Trust Wallet, Coinbase Wallet, and other standard wallets work seamlessly. Your existing wallet addresses will be identical due to our BIP-44 compliance."
    },
    {
      question: "Is WalletX completely free to use?",
      answer: "Yes, WalletX is completely free and open source. There are no subscription fees, hidden costs, or premium features. You only pay standard blockchain network fees (gas fees) when making transactions or using escrow services. All features including multi-chain support, QR code functionality, escrow system, faucet access, and AI assistance are available at no cost."
    },
    {
      question: "How does WalletX ensure compatibility with existing DeFi and Web3 applications?",
      answer: "WalletX uses industry-standard cryptographic methods: BIP-39 for mnemonic generation, BIP-44 for hierarchical derivation, EIP-155 for chain IDs, and EIP-1559 for gas fees. This ensures full compatibility with all major wallet providers and Web3 applications. WalletX-generated wallets work seamlessly with DeFi protocols, NFT marketplaces, and dApps across all 8 supported networks, with the integrated escrow system enabling secure DeFi interactions."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative py-20 bg-neutral-950">
      <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Get quick answers to common questions about WalletX
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl overflow-hidden hover:border-neutral-600 transition-all duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-800/30 transition-colors duration-200"
              >
                <h3 className="text-base font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-purple-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-400 text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ