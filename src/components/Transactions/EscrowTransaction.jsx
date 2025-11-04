import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { 
  Wallet, 
  Send, 
  RefreshCw, 
  AlertCircle, 
  Droplets, 
  ExternalLink, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  QrCode,
  Camera
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getBlockchainConfig, getNetworkConfig } from '../../lib/networks'
import { getEVMBalance, getEVMProvider } from '../../lib/evmWalletUtils'
import { 
  createEscrow,
  claimEscrow,
  refundEscrow,
  getEscrowTransactionHistory,
  getEscrowTransactionHistoryWithRealTimeStatus,
  getPendingActions,
  getEscrowDetails,
  getEscrowStatusText,
  getEscrowStatusColor,
  formatTimestamp,
  EscrowStatus,
  WALLETX_CONTRACT_ADDRESS,
  debugEscrow
} from '../../lib/contractUtils'
import QRScannerModal from '../Wallet/EthComponents/QRScannerModal'
import polygonLogo from '../../assests/polygon-matic-logo.svg'
import baseLogo from '../../assests/base-logo.svg'
import sepoliaLogo from '../../assests/sepolia-logo.svg'
import bnbLogo from '../../assests/bnb-logo.svg'
import zetachainLogo from '../../assests/zetachain-logo.svg'
import somniaLogo from '../../assests/somnia.svg'
import liskLogo from '../../assests/lisk-logo.svg'
import citeraLogo from '../../assests/citera-logo.svg'

function EscrowTransaction({ walletData, blockchain }) {
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('send')
  const [currentBlockchain, setCurrentBlockchain] = useState(blockchain)
  
  // Initialize network with testnet as default
  const [network, setNetwork] = useState(() => {
    const config = getBlockchainConfig(blockchain)
    if (config) {
      const networks = Object.keys(config.networks).sort((a, b) => {
        if (a === 'mainnet') return 1
        if (b === 'mainnet') return -1
        return a.localeCompare(b)
      })
      return networks[0] || 'testnet'
    }
    return 'testnet'
  })

  // Listen for blockchain changes from parent component
  useEffect(() => {
    setCurrentBlockchain(blockchain)
    // Load saved network selection
    const savedNetwork = localStorage.getItem('selected_network')
    if (savedNetwork && savedNetwork !== blockchain) {
      setCurrentBlockchain(savedNetwork)
    }
    
    // Reset to testnet when switching blockchains
    const config = getBlockchainConfig(savedNetwork || blockchain)
    if (config) {
      const networks = Object.keys(config.networks).sort((a, b) => {
        if (a === 'mainnet') return 1
        if (b === 'mainnet') return -1
        return a.localeCompare(b)
      })
      setNetwork(networks[0] || 'testnet')
    }
    setSendForm({ to: '', amount: '', gasLimit: '500000' })
    setEscrowHistory([])
    setPendingActions({ claimable: [], refundable: [] })
  }, [blockchain])

  const [sendForm, setSendForm] = useState({
    to: '',
    amount: '',
    gasLimit: '500000' // Higher default for better reliability with complex contracts
  })
  
  const [sending, setSending] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState('')
  
  // Escrow data
  const [escrowHistory, setEscrowHistory] = useState([])
  const [pendingActions, setPendingActions] = useState({ claimable: [], refundable: [] })
  const [loadingActions, setLoadingActions] = useState({})
  const [refreshingPending, setRefreshingPending] = useState(false)
  const [refreshingHistory, setRefreshingHistory] = useState(false)

  // QR Scanner state
  const [showQRScanner, setShowQRScanner] = useState(false)

  const blockchainConfig = getBlockchainConfig(currentBlockchain)
  const currentNetworkConfig = getNetworkConfig(currentBlockchain, network)

  // Get available networks for this blockchain, with testnets first
  const availableNetworks = blockchainConfig ?
    Object.keys(blockchainConfig.networks).sort((a, b) => {
      if (a === 'mainnet') return 1
      if (b === 'mainnet') return -1
      return a.localeCompare(b)
    }) : []

  // Function to get the correct logo based on blockchain
  const getBlockchainLogo = (blockchain) => {
    switch (blockchain) {
      case 'polygon':
        return polygonLogo
      case 'base':
        return baseLogo
      case 'sepolia':
        return sepoliaLogo
      case 'bnb':
        return bnbLogo
      case 'zetachain':
        return zetachainLogo
      case 'somnia':
        return somniaLogo
      case 'lisk':
        return liskLogo
      case 'citera':
        return citeraLogo
      default:
        return baseLogo // fallback to base
    }
  }

  const fetchBalance = async () => {
    setLoading(true)
    try {
      const balanceEth = await getEVMBalance(currentBlockchain, network, walletData.publicKey)
      setBalance(balanceEth)
    } catch (error) {
      console.error('Error fetching balance:', error)
      toast.error(`Failed to fetch balance: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchEscrowData = async (showToast = true) => {
    try {
      console.log('🔄 Fetching escrow data - including real-time status updates from blockchain')
      
      // Get escrow history with real-time status updates from blockchain
      console.log('📡 Fetching escrow history with real-time status from contract...')
      const historyWithUpdatedStatus = await getEscrowTransactionHistoryWithRealTimeStatus(currentBlockchain, network, walletData.publicKey, 50)
      console.log(`📦 Found ${historyWithUpdatedStatus.length} transactions with updated status`)
      setEscrowHistory(historyWithUpdatedStatus)

      // Fetch fresh pending actions from contract
      try {
        console.log('🌐 Fetching fresh pending actions from contract...')
        
        // Fetch pending actions from contract
        console.log('Fetching pending actions for wallet:', walletData.publicKey)
        const actions = await getPendingActions(currentBlockchain, network, walletData.publicKey)
        console.log('Pending actions fetched in component:', actions)
        
        // Validate the structure of the returned actions
        if (actions && typeof actions === 'object') {
          const claimable = Array.isArray(actions.claimable) ? actions.claimable : []
          const refundable = Array.isArray(actions.refundable) ? actions.refundable : []
          
          setPendingActions({
            claimable,
            refundable
          })
          
          console.log('✅ Pending actions updated:', { claimable, refundable })
        } else {
          console.error('Invalid pending actions structure:', actions)
          setPendingActions({ claimable: [], refundable: [] })
        }
        
        console.log('✅ Fresh contract data fetched successfully')
        
        // Show success message to user
        if (showToast) {
          toast.success('🔄 Data refreshed with real-time status!')
        }
        
      } catch (actionsError) {
        console.error('❌ Error fetching fresh contract data:', actionsError)
        // Set empty arrays to avoid UI errors, but keep updated history
        setPendingActions({ claimable: [], refundable: [] })
        if (showToast) {
          toast.error(`Failed to fetch fresh data: ${actionsError.message}`)
        }
      }
      
      console.log('🎉 Escrow data refresh with real-time status completed')
    } catch (error) {
      console.error('❌ Error in fetchEscrowData:', error)
      // Fallback to cached data if real-time fetch fails
      try {
        console.log('🔄 Falling back to cached escrow history...')
        const cachedHistory = await getEscrowTransactionHistory(currentBlockchain, network, walletData.publicKey, 50)
        setEscrowHistory(cachedHistory)
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError)
      }
      if (showToast) {
        toast.error(`Failed to fetch escrow data: ${error.message}`)
      }
    }
  }

  useEffect(() => {
    if (blockchainConfig) {
      fetchBalance()
      fetchEscrowData(false) // Don't show toast on initial load
    }
    
    // Make debug function available in console
    if (typeof window !== 'undefined') {
      window.debugEscrow = (escrowId) => {
        return debugEscrow(currentBlockchain, network, escrowId, walletData.publicKey)
      }
      
      // Add debug helper for transaction history
      window.debugEscrowHistory = () => {
        const { debugEscrowTransactions } = require('../../lib/escrowStorage')
        return debugEscrowTransactions(currentBlockchain, network, walletData.publicKey)
      }
      
      // Add debug helper for localStorage keys
      window.debugEscrowStorage = () => {
        const keys = Object.keys(localStorage).filter(key => key.includes('escrow_tx_history'))
        console.log('🗂 Escrow storage keys found:', keys)
        keys.forEach(key => {
          const data = JSON.parse(localStorage.getItem(key) || '[]')
          console.log(`📁 ${key}:`, data)
        })
        return keys
      }
      
      console.log('🔧 Debug helpers available:')
      console.log('  - window.debugEscrow(escrowId) - Debug specific escrow')
      console.log('  - window.debugEscrowHistory() - Show cached transaction history')
      console.log('  - window.debugEscrowStorage() - Show all escrow storage keys')
    }
  }, [walletData.publicKey, network, currentBlockchain, blockchainConfig])

  // Auto-refresh balance and escrow data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !sending && blockchainConfig) {
        fetchBalance()
        fetchEscrowData(false) // Don't show toast on auto-refresh
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [loading, sending, currentBlockchain, blockchainConfig])

  // Handle QR scanner functions
  const handleShowQRScanner = () => {
    setShowQRScanner(true)
  }

  const handleCloseQRScanner = () => {
    setShowQRScanner(false)
  }

  const handleQRScanResult = (address) => {
    handleInputChange('to', address)
    setShowQRScanner(false)
  }

  const handleCreateEscrow = async (e) => {
    e.preventDefault()

    if (!sendForm.to || !sendForm.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!ethers.isAddress(sendForm.to)) {
      toast.error('Invalid recipient address')
      return
    }

    const amount = parseFloat(sendForm.amount)
    if (amount <= 0 || amount > parseFloat(balance)) {
      toast.error('Invalid amount')
      return
    }

    setSending(true)
    setTransactionStatus('Creating escrow...')

    try {
      const txResponse = await createEscrow(
        currentBlockchain,
        network,
        walletData.privateKey,
        sendForm.to,
        sendForm.amount,
        sendForm.gasLimit
      )

      toast.success(`Escrow created! Hash: ${txResponse.hash}`)
      setTransactionStatus('Waiting for confirmation...')
      
      // Handle the transaction receipt
      let receipt;
      try {
        // Check if wait method exists and is a function
        if (txResponse.wait && typeof txResponse.wait === 'function') {
          receipt = await txResponse.wait(1); // Wait for 1 confirmation
        } else {
          // Fallback if wait is not available
          console.log('Using fallback waitForTransaction method');
          const provider = getEVMProvider(currentBlockchain, network);
          receipt = await provider.waitForTransaction(txResponse.hash, 1);
        }
      } catch (waitError) {
        console.warn('Error waiting for transaction:', waitError);
        // Continue with the flow even if waiting fails
        receipt = { blockNumber: 'unknown' };
      }
      setTransactionStatus('Success!')
      toast.success(`🎉 Escrow confirmed in block ${receipt.blockNumber}`)

      // Reset form and refresh data
      setSendForm({ to: '', amount: '', gasLimit: '500000' })
      await fetchBalance()
      await fetchEscrowData(false)

    } catch (error) {
      console.error('Escrow creation error:', error)
      toast.error(`Escrow creation failed: ${error.message}`)
      setTransactionStatus('Escrow creation failed')
    } finally {
      setTimeout(() => {
        setSending(false)
        setTransactionStatus('')
      }, 2000)
    }
  }

  const handleClaimEscrow = async (escrowId) => {
    setLoadingActions(prev => ({ ...prev, [`claim-${escrowId}`]: true }))
    try {
      const txResponse = await claimEscrow(currentBlockchain, network, walletData.privateKey, escrowId)
      toast.success(`Claim transaction sent! Hash: ${txResponse.hash}`)
      
      let receipt;
      try {
        // Check if wait method exists and is a function
        if (txResponse.wait && typeof txResponse.wait === 'function') {
          receipt = await txResponse.wait(1); // Wait for 1 confirmation
        } else {
          // Fallback if wait is not available
          console.log('Using fallback waitForTransaction method for claim');
          const provider = getEVMProvider(currentBlockchain, network);
          receipt = await provider.waitForTransaction(txResponse.hash, 1);
        }
        toast.success(`🎉 Escrow claimed successfully!`)
      } catch (waitError) {
        console.warn('Error waiting for claim transaction:', waitError)
        // Continue with the flow even if waiting fails
      }
      
      await fetchBalance()
      await fetchEscrowData(false)
    } catch (error) {
      console.error('Claim error:', error)
      toast.error(`Claim failed: ${error.message}`)
    } finally {
      setLoadingActions(prev => ({ ...prev, [`claim-${escrowId}`]: false }))
    }
  }

  const handleRefundEscrow = async (escrowId) => {
    setLoadingActions(prev => ({ ...prev, [`refund-${escrowId}`]: true }))
    try {
      const txResponse = await refundEscrow(currentBlockchain, network, walletData.privateKey, escrowId)
      toast.success(`Refund transaction sent! Hash: ${txResponse.hash}`)
      
      let receipt;
      try {
        // Check if wait method exists and is a function
        if (txResponse.wait && typeof txResponse.wait === 'function') {
          receipt = await txResponse.wait(1); // Wait for 1 confirmation
        } else {
          // Fallback if wait is not available
          console.log('Using fallback waitForTransaction method for refund');
          const provider = getEVMProvider(currentBlockchain, network);
          receipt = await provider.waitForTransaction(txResponse.hash, 1);
        }
        toast.success(`🎉 Escrow refunded successfully!`)
      } catch (waitError) {
        console.warn('Error waiting for refund transaction:', waitError)
        // Continue with the flow even if waiting fails
      }
      
      await fetchBalance()
      await fetchEscrowData(false)
    } catch (error) {
      console.error('Refund error:', error)
      toast.error(`Refund failed: ${error.message}`)
    } finally {
      setLoadingActions(prev => ({ ...prev, [`refund-${escrowId}`]: false }))
    }
  }

  const handleInputChange = (field, value) => {
    setSendForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNetworkChange = (newNetwork) => {
    setNetwork(newNetwork)
    setSendForm({ to: '', amount: '', gasLimit: '500000' })
  }

  const openFaucet = () => {
    const networkConfig = getNetworkConfig(blockchain, network)
    if (networkConfig?.faucetUrl) {
      window.open(networkConfig.faucetUrl, '_blank')
    } else {
      toast.error('No faucet available for this network')
    }
  }

  const openExplorer = (hash = null) => {
    const networkConfig = getNetworkConfig(blockchain, network)
    if (networkConfig?.explorerUrl) {
      const url = hash 
        ? `${networkConfig.explorerUrl}/tx/${hash}`
        : `${networkConfig.explorerUrl}/address/${walletData.publicKey}`
      window.open(url, '_blank')
    }
  }

  if (!blockchainConfig) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-white mb-4">Unsupported Blockchain</h2>
          <p className="text-gray-400">The blockchain "{blockchain}" is not supported.</p>
        </div>
      </div>
    )
  }

  const isTestnet = network !== 'mainnet'

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8 space-y-6 md:space-y-8">
      {/* Network Selection */}
      {/* <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-400/20 rounded-xl blur opacity-75"></div>
        <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="relative inline-block overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <div className="inline-flex items-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 justify-center bg-neutral-950 backdrop-blur-3xl">
                <img src={getBlockchainLogo(blockchain)} alt={blockchain} width={20} height={20} />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white font-geist">Network Selection</h2>
          </div>

          <div className={`grid gap-3 sm:gap-4 ${availableNetworks.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {availableNetworks.map((networkKey) => {
              const networkConfig = blockchainConfig.networks[networkKey]
              const isMainnet = networkKey === 'mainnet'

              return (
                <button
                  key={networkKey}
                  onClick={() => handleNetworkChange(networkKey)}
                  className={`relative group p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                    network === networkKey
                      ? isMainnet
                        ? 'border-green-500/50 bg-green-600/10'
                        : 'border-purple-500/50 bg-purple-600/10'
                      : 'border-neutral-600 bg-neutral-800/30 hover:border-neutral-500 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-left min-w-0 flex-1">
                      <img src={getBlockchainLogo(blockchain)} alt={blockchain} width={24} height={24} className="flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">{networkConfig.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {isMainnet ? `Live network with real ${blockchainConfig.symbol}` : 'Test network for development'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors flex-shrink-0 ml-3 ${
                      network === networkKey
                        ? isMainnet
                          ? 'border-green-500 bg-green-500'
                          : 'border-purple-500 bg-purple-500'
                        : 'border-gray-400'
                    }`}>
                      {network === networkKey && (
                        <div className={`w-full h-full rounded-full animate-pulse ${
                          isMainnet ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div> */}

      {/* Balance Card */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-75"></div>
        <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="relative inline-block overflow-hidden rounded-full p-[1px]">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <div className="inline-flex items-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 justify-center bg-neutral-950 backdrop-blur-3xl">
                  <Wallet className="text-purple-400" size={20} />
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white font-geist">Wallet Balance</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentNetworkConfig?.faucetUrl && isTestnet && (
                <button
                  onClick={openFaucet}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 border border-green-600/30 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                >
                  <Droplets size={14} />
                  <span>Faucet</span>
                </button>
              )}
              {currentNetworkConfig?.explorerUrl && (
                <button
                  onClick={() => openExplorer()}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-600/30 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                >
                  <ExternalLink size={14} />
                  <span>Explorer</span>
                </button>
              )}
              <button
                onClick={fetchBalance}
                disabled={loading}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-600/30 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={14} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 p-4 sm:p-6 rounded-lg">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 break-all">
              {loading ? '...' : `${parseFloat(balance).toFixed(6)} ${blockchainConfig.symbol}`}
            </p>
            <p className="text-xs sm:text-sm text-purple-400 font-medium">
              {currentNetworkConfig?.name || `${blockchainConfig.name} ${network}`}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-400/20 rounded-xl blur opacity-75"></div>
        <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-2">
          <div className="flex space-x-1">
            {[
              { id: 'send', label: 'Send Escrow', icon: Shield },
              { id: 'actions', label: 'Pending Actions', icon: Clock },
              { id: 'history', label: 'Transaction History', icon: History }
            ].map((tab) => {
              const totalPending = pendingActions.claimable.length + pendingActions.refundable.length
              const showBadge = tab.id === 'actions' && totalPending > 0
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium relative ${
                    activeTab === tab.id
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-neutral-800/50'
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 animate-pulse">
                      {totalPending}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'send' && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-75"></div>
          <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="relative inline-block overflow-hidden rounded-full p-[1px]">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <div className="inline-flex items-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 justify-center bg-neutral-950 backdrop-blur-3xl">
                  <Shield className="text-purple-400" size={20} />
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white font-geist">Create Escrow</h2>
            </div>

            <form onSubmit={handleCreateEscrow} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 font-geist">
                    Recipient Address *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sendForm.to}
                      onChange={(e) => handleInputChange('to', e.target.value)}
                      placeholder="0x..."
                      className="flex-1 px-4 py-3 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-neutral-800/50 text-gray-200 placeholder-gray-400 transition-all duration-200 hover:border-neutral-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleShowQRScanner}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors font-medium flex-shrink-0"
                      title="Scan QR Code"
                    >
                      <Camera size={16} />
                      <span className="hidden sm:inline">Scan</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3 font-geist">
                      Amount ({blockchainConfig.symbol}) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.000001"
                        min="0"
                        max={balance}
                        value={sendForm.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="0.001"
                        className="w-full px-4 py-3 pr-16 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-neutral-800/50 text-gray-200 placeholder-gray-400 transition-all duration-200 hover:border-neutral-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('amount', (parseFloat(balance) * 0.9).toFixed(6))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-xs hover:text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 px-3 py-1.5 rounded-md transition-colors border border-purple-600/30"
                      >
                        Max
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-geist">
                      Available: {parseFloat(balance).toFixed(6)} {blockchainConfig.symbol}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3 font-geist">
                      Gas Limit
                      <span className="text-xs text-gray-400 ml-2">(Auto-adjusted for complex contracts)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="300000"
                        max="5000000"
                        value={sendForm.gasLimit}
                        onChange={(e) => handleInputChange('gasLimit', e.target.value)}
                        className="w-full px-4 py-3 pr-20 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-neutral-800/50 text-gray-200 placeholder-gray-400 transition-all duration-200 hover:border-neutral-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('gasLimit', '500000')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-xs hover:text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 px-2 py-1 rounded transition-colors border border-purple-600/30"
                        title="Set recommended gas for complex escrow contracts"
                      >
                        Auto
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-2 space-y-1">
                      <p className="font-geist">• Simple escrow: 300,000 - 500,000 gas</p>
                      <p className="font-geist">• Complex contracts: 500,000+ gas</p>
                      <p className="font-geist text-yellow-400">⚠️ Gas will be auto-adjusted based on contract complexity</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="text-purple-400 mt-0.5" size={16} />
                  <div className="text-sm text-purple-300">
                    <p className="font-medium">Escrow Protection</p>
                    <p>Funds will be held securely in the smart contract. The recipient can claim them, or you can refund if unclaimed.</p>
                  </div>
                </div>
              </div>

              <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] w-full">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 backdrop-blur-3xl">
                  <button
                    type="submit"
                    disabled={sending || loading || parseFloat(balance) === 0}
                    className="w-full relative group inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent py-3 px-6 text-center text-white transition-all duration-300 hover:bg-transparent/90 disabled:cursor-not-allowed gap-3 font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none font-geist"
                  >
                    <div className="relative flex items-center gap-3">
                      {sending ? (
                        <>
                          <RefreshCw className="animate-spin" size={18} />
                          <span>{transactionStatus || 'Creating Escrow...'}</span>
                        </>
                      ) : (
                        <>
                          <Shield size={18} />
                          <span>Create Escrow</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </span>
            </form>
          </div>
        </div>
      )}      
{/* Pending Actions Tab */}
      {activeTab === 'actions' && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-75"></div>
          <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="relative inline-block overflow-hidden rounded-full p-[1px]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <div className="inline-flex items-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 justify-center bg-neutral-950 backdrop-blur-3xl">
                    <Clock className="text-purple-400" size={20} />
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white font-geist">Pending Actions</h2>
                {(pendingActions.claimable.length > 0 || pendingActions.refundable.length > 0) && (
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm font-medium rounded-full border border-purple-600/30">
                    {pendingActions.claimable.length + pendingActions.refundable.length} pending
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setRefreshingPending(true)
                  fetchEscrowData(false).finally(() => setRefreshingPending(false))
                }}
                disabled={refreshingPending}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-600/30 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium min-w-[100px] justify-center"
              >
                <RefreshCw className={refreshingPending ? 'animate-spin' : ''} size={16} />
                <span>{refreshingPending ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Claimable Escrows */}
              {pendingActions.claimable.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <ArrowDownLeft size={20} />
                    Claimable Escrows ({pendingActions.claimable.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingActions.claimable.map((escrowId) => (
                      <EscrowActionCard
                        key={`claim-${escrowId}`}
                        escrowId={escrowId}
                        type="claim"
                        blockchain={blockchain}
                        network={network}
                        onAction={handleClaimEscrow}
                        loading={loadingActions}
                        blockchainSymbol={blockchainConfig.symbol}
                        openExplorer={openExplorer}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Refundable Escrows */}
              {pendingActions.refundable.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <ArrowUpRight size={20} />
                    Refundable Escrows ({pendingActions.refundable.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingActions.refundable.map((escrowId) => (
                      <EscrowActionCard
                        key={`refund-${escrowId}`}
                        escrowId={escrowId}
                        type="refund"
                        blockchain={blockchain}
                        network={network}
                        onAction={handleRefundEscrow}
                        loading={loadingActions}
                        blockchainSymbol={blockchainConfig.symbol}
                        openExplorer={openExplorer}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No Pending Actions */}
              {pendingActions.claimable.length === 0 && pendingActions.refundable.length === 0 && (
                <div className="text-center py-12">
                  <div className="relative inline-block overflow-hidden rounded-full p-[2px] mb-6">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 bg-neutral-950 backdrop-blur-3xl">
                      <Clock className="text-gray-400" size={32} />
                    </div>
                  </div>
                  <p className="text-lg text-gray-300 font-geist mb-2">No pending actions</p>
                  <p className="text-sm text-gray-400">
                    Escrows you can claim or refund will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Tab */}
      {activeTab === 'history' && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-75"></div>
          <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="relative inline-block overflow-hidden rounded-full p-[1px]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <div className="inline-flex items-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 justify-center bg-neutral-950 backdrop-blur-3xl">
                    <History className="text-purple-400" size={20} />
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white font-geist">Escrow History</h2>
              </div>
              <button
                onClick={() => {
                  setRefreshingHistory(true)
                  fetchEscrowData(false).finally(() => setRefreshingHistory(false))
                }}
                disabled={refreshingHistory}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-600/30 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium min-w-[100px] justify-center"
              >
                <RefreshCw className={refreshingHistory ? 'animate-spin' : ''} size={16} />
                <span>{refreshingHistory ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            {escrowHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative inline-block overflow-hidden rounded-full p-[2px] mb-6">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 bg-neutral-950 backdrop-blur-3xl">
                    <History className="text-gray-400" size={32} />
                  </div>
                </div>
                <p className="text-lg text-gray-300 font-geist mb-2">No escrow transactions found</p>
                <p className="text-sm text-gray-400">
                  Your escrow transactions will appear here after creating or receiving escrows
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {escrowHistory.map((tx, index) => (
                  <EscrowHistoryCard
                    key={tx.hash || index}
                    transaction={tx}
                    blockchainSymbol={blockchainConfig.symbol}
                    openExplorer={openExplorer}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showQRScanner}
        onClose={handleCloseQRScanner}
        onScanResult={handleQRScanResult}
      />
    </div>
  )
}

// Escrow Action Card Component
function EscrowActionCard({ escrowId, type, blockchain, network, onAction, loading, blockchainSymbol, openExplorer }) {
  const [escrowDetails, setEscrowDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await getEscrowDetails(blockchain, network, escrowId)
        setEscrowDetails(details)
      } catch (error) {
        console.error('Error fetching escrow details:', error)
      } finally {
        setLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [escrowId, blockchain, network])

  if (loadingDetails) {
    return (
      <div className="p-4 border border-neutral-600 rounded-xl bg-neutral-800/30 animate-pulse">
        <div className="h-4 bg-neutral-700 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
      </div>
    )
  }

  if (!escrowDetails) {
    return null
  }

  const isClaimAction = type === 'claim'
  const actionColor = isClaimAction ? 'green' : 'red'
  const actionText = isClaimAction ? 'Claim' : 'Refund'
  const actionIcon = isClaimAction ? CheckCircle : XCircle

  return (
    <div className={`relative p-4 border rounded-xl ${isClaimAction ? 'border-green-600/30 bg-green-600/10' : 'border-red-600/30 bg-red-600/10'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isClaimAction ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
            {isClaimAction ? <CheckCircle size={16} /> : <XCircle size={16} />}
          </div>
          <div>
            <h4 className={`font-semibold text-sm ${isClaimAction ? 'text-green-300' : 'text-red-300'}`}>
              {/* Escrow #{escrowId} */}
              Escrow
            </h4>
            <p className="text-xs text-gray-400">
              {isClaimAction ? 'From' : 'To'}: {(isClaimAction ? escrowDetails.sender : escrowDetails.receiver).slice(0, 6)}...{(isClaimAction ? escrowDetails.sender : escrowDetails.receiver).slice(-4)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold ${isClaimAction ? 'text-green-400' : 'text-red-400'}`}>
            {escrowDetails.amount} {blockchainSymbol}
          </p>
          <p className="text-xs text-gray-400">
            {formatTimestamp(escrowDetails.createdAt)}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onAction(escrowId)}
          disabled={loading[`${type}-${escrowId}`]}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium border ${
            isClaimAction 
              ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 border-green-600/30' 
              : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border-red-600/30'
          }`}
        >
          {loading[`${type}-${escrowId}`] ? (
            <RefreshCw className="animate-spin" size={14} />
          ) : (
            isClaimAction ? <CheckCircle size={14} /> : <XCircle size={14} />
          )}
          <span>{actionText}</span>
        </button>
        
        <button
          onClick={() => openExplorer(escrowDetails.hash)}
          className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-600/30 rounded-lg transition-colors text-sm"
        >
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  )
}

// Escrow History Card Component
function EscrowHistoryCard({ transaction, blockchainSymbol, openExplorer }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'escrow_created':
        return ArrowUpRight
      case 'escrow_received':
        return ArrowDownLeft
      case 'escrow_claimed':
        return CheckCircle
      case 'escrow_refunded':
        return XCircle
      default:
        return Shield
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'escrow_created':
        return 'text-red-400 bg-red-600/20 border-red-600/30'
      case 'escrow_received':
        return 'text-green-400 bg-green-600/20 border-green-600/30'
      case 'escrow_claimed':
        return 'text-green-400 bg-green-600/20 border-green-600/30'
      case 'escrow_refunded':
        return 'text-red-400 bg-red-600/20 border-red-600/30'
      default:
        return 'text-purple-400 bg-purple-600/20 border-purple-600/30'
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case 'escrow_created':
        return 'Escrow Created'
      case 'escrow_received':
        return 'Escrow Received'
      case 'escrow_claimed':
        return 'Escrow Claimed'
      case 'escrow_refunded':
        return 'Escrow Refunded'
      default:
        return 'Escrow Transaction'
    }
  }

  const TypeIcon = getTypeIcon(transaction.type)
  const typeColor = getTypeColor(transaction.type)
  const typeText = getTypeText(transaction.type)

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => openExplorer(transaction.hash)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 to-green-400/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border border-neutral-600 rounded-xl bg-neutral-800/30 hover:bg-neutral-800/50 hover:border-neutral-500 transition-all duration-300 hover:shadow-lg gap-3 sm:gap-0">
        
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
          <div className="relative flex-shrink-0">
            <div className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 border ${typeColor} group-hover:scale-110`}>
              <TypeIcon size={16} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <p className="font-semibold text-white font-geist text-sm sm:text-base">
                {typeText}
              </p>
              {transaction.escrowId && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30">
                  {/* #{transaction.escrowId} */}Tokens
                </span>
              )}
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getEscrowStatusColor(transaction.status)}`}>
                {getEscrowStatusText(transaction.status)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-300 mb-2">
              <span className="font-geist">{formatTimestamp(transaction.timestamp)}</span>
              <span className="text-gray-500">•</span>
              <span className="font-mono text-xs bg-neutral-700/50 px-2 py-1 rounded-md border border-neutral-600/30 break-all">
                {transaction.hash?.slice(0, 6)}...{transaction.hash?.slice(-4)}
              </span>
            </div>

            <div className="text-xs text-gray-400">
              <span className="font-geist">
                {transaction.isIncoming ? 'From: ' : 'To: '}
              </span>
              <span className="font-mono bg-neutral-700/30 px-1.5 py-0.5 rounded border border-neutral-600/20 break-all">
                {transaction.isIncoming
                  ? `${transaction.from?.slice(0, 4)}...${transaction.from?.slice(-3)}`
                  : `${transaction.to?.slice(0, 4)}...${transaction.to?.slice(-3)}`
                }
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="text-left sm:text-right">
            <p className={`font-bold text-base sm:text-lg font-geist break-all ${
              transaction.isIncoming ? 'text-green-400' : 'text-red-400'
            }`}>
              {transaction.isIncoming ? '+' : '-'}{transaction.amount} {blockchainSymbol}
            </p>
            <p className="text-xs text-gray-400 mt-1 font-geist">
              {transaction.isIncoming ? 'Received' : 'Sent'}
            </p>
          </div>

          <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors flex-shrink-0">
            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EscrowTransaction