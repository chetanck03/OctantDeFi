import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Wallet, Send, RefreshCw, AlertCircle, Droplets, ExternalLink, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import EVMTransactionHistory from './EVMTransactionHistory'
import { QRScannerModal } from '../Wallet/EthComponents'
import { getBlockchainConfig, getNetworkConfig, NETWORK_CONFIGS } from '../../lib/networks'
import { getEVMBalance, sendEVMTransaction } from '../../lib/evmWalletUtils'
import { 
  getContractWalletBalance, 
  sendETHThroughContract,
  WALLET_MANAGER_ADDRESS 
} from '../../lib/contractUtils'
import polygonLogo from '../../assests/polygon-matic-logo.svg'
import baseLogo from '../../assests/base-logo.svg'
import sepoliaLogo from '../../assests/sepolia-logo.svg'
import bnbLogo from '../../assests/bnb-logo.svg'
import zetachainLogo from '../../assests/zetachain-logo.svg'
import somniaLogo from '../../assests/somnia.svg'
import liskLogo from '../../assests/lisk-logo.svg'
import citeraLogo from '../../assests/citera-logo.svg'

function EVMTransaction({ walletData, blockchain: initialBlockchain }) {
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(false)
  const [currentBlockchain, setCurrentBlockchain] = useState(initialBlockchain || 'base')
  
  // Initialize network with testnet as default
  const [network, setNetwork] = useState(() => {
    const config = getBlockchainConfig(currentBlockchain)
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
  const [sendForm, setSendForm] = useState({
    to: '',
    amount: '',
    gasLimit: '300000' // Increased default gas limit to handle contract interactions
  })
  const [sending, setSending] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState('')
  
  // Contract mode state - disabled for now
  const [useContract, setUseContract] = useState(false)
  
  // QR Scanner state
  const [showQRScanner, setShowQRScanner] = useState(false)
  
  // Update gas limit when contract mode changes
  useEffect(() => {
    setSendForm(prev => ({
      ...prev,
      gasLimit: useContract ? '300000' : '21000'
    }))
  }, [useContract])

  const blockchainConfig = getBlockchainConfig(currentBlockchain)
  const currentNetworkConfig = getNetworkConfig(currentBlockchain, network)

  // Listen for blockchain changes from parent component
  useEffect(() => {
    setCurrentBlockchain(initialBlockchain)
    // Load saved network selection
    const savedNetwork = localStorage.getItem('selected_network')
    if (savedNetwork && savedNetwork !== initialBlockchain) {
      setCurrentBlockchain(savedNetwork)
    }
    
    // Reset to testnet when switching blockchains
    const config = getBlockchainConfig(savedNetwork || initialBlockchain)
    if (config) {
      const networks = Object.keys(config.networks).sort((a, b) => {
        if (a === 'mainnet') return 1
        if (b === 'mainnet') return -1
        return a.localeCompare(b)
      })
      setNetwork(networks[0] || 'testnet')
    }
    setBalance('0')
    setSendForm({ to: '', amount: '', gasLimit: '300000' })
  }, [initialBlockchain])

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
      let balanceEth
      if (useContract && WALLET_MANAGER_ADDRESS) {
        balanceEth = await getContractWalletBalance(currentBlockchain, network, walletData.publicKey)
      } else {
        balanceEth = await getEVMBalance(currentBlockchain, network, walletData.publicKey)
      }
      setBalance(balanceEth)
    } catch (error) {
      console.error('Error fetching balance:', error)
      toast.error(`Failed to fetch balance: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }





  // Auto-enable contract mode for Somnia Testnet
  useEffect(() => {
    const shouldUseContract = currentBlockchain === 'polygon' && network === 'testnet' && WALLET_MANAGER_ADDRESS
    setUseContract(shouldUseContract)
    
    if (blockchainConfig) {
      fetchBalance()
    }
  }, [walletData.publicKey, network, currentBlockchain, blockchainConfig])

  // Auto-refresh balance every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !sending && blockchainConfig) {
        fetchBalance()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [loading, sending, currentBlockchain])

  // Listen for transaction completion events to refresh balance
  useEffect(() => {
    const handleTransactionCompleted = (event) => {
      const { blockchain: eventBlockchain } = event.detail

      if (eventBlockchain === currentBlockchain) {
        // Refresh balance after a short delay
        setTimeout(() => {
          fetchBalance()
        }, 1000)
      }
    }

    window.addEventListener('transactionCompleted', handleTransactionCompleted)

    return () => {
      window.removeEventListener('transactionCompleted', handleTransactionCompleted)
    }
  }, [currentBlockchain])

  const handleSendTransaction = async (e) => {
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
    setTransactionStatus('Preparing transaction...')
    let transactionSent = false

    // Safety timeout to prevent button from getting stuck
    const safetyTimeout = setTimeout(() => {
      setSending(false)
      setTransactionStatus('')
      toast.error('Transaction timed out. Please try again.')
    }, 60000) // 60 seconds maximum

    try {
      setTransactionStatus('Sending transaction...')

      let txResponse
      if (useContract && WALLET_MANAGER_ADDRESS) {
        // Send through contract (no registration required)
        txResponse = await sendETHThroughContract(
          currentBlockchain,
          network,
          walletData.privateKey,
          sendForm.to,
          sendForm.amount,
          sendForm.gasLimit // Pass the gas limit to the contract function
        )
      } else {
        // Send transaction using universal EVM function
        txResponse = await sendEVMTransaction(
          currentBlockchain,
          network,
          walletData.privateKey,
          sendForm.to,
          sendForm.amount,
          sendForm.gasLimit
        )
      }

      transactionSent = true
      toast.success(`Transaction sent! Hash: ${txResponse.hash}`)
      setTransactionStatus('Waiting for confirmation...')

      // Wait for confirmation
      const receipt = await txResponse.wait()
      setTransactionStatus('Success!')
      toast.success(`🎉 Transaction confirmed in block ${receipt.blockNumber}`)

      // Reset form and refresh data
      setSendForm({ to: '', amount: '', gasLimit: '300000' })

      // Auto-refresh balance and transaction history
      await fetchBalance()

      // Trigger transaction history refresh by dispatching custom event
      const refreshEvent = new CustomEvent('transactionCompleted', {
        detail: { blockchain: currentBlockchain, hash: txResponse.hash }
      })
      window.dispatchEvent(refreshEvent)

    } catch (error) {
      console.error('Transaction error:', error)

      // Show appropriate error message based on transaction state
      if (transactionSent) {
        toast.error(`Transaction confirmation failed: ${error.message}`)
        setTransactionStatus('Transaction confirmation failed')
      } else {
        toast.error(`Transaction failed: ${error.message}`)
        setTransactionStatus('Transaction failed')
      }
    } finally {
      // Clear the safety timeout
      clearTimeout(safetyTimeout)

      // Always reset the button state after a reasonable delay
      const resetDelay = transactionSent ? 1500 : 3000

      setTimeout(() => {
        setSending(false)
        setTransactionStatus('')
      }, resetDelay)

      // Additional safety reset after 5 seconds no matter what
      setTimeout(() => {
        if (sending) {
          console.log('Safety reset: Force clearing stuck transaction state')
          setSending(false)
          setTransactionStatus('')
        }
      }, 5000)
    }
  }

  const handleInputChange = (field, value) => {
    setSendForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // QR Scanner handlers
  const handleShowQRScanner = () => {
    setShowQRScanner(true)
  }

  const handleCloseQRScanner = () => {
    setShowQRScanner(false)
  }

  const handleQRScanResult = (scannedAddress) => {
    if (scannedAddress) {
      handleInputChange('to', scannedAddress)
      setShowQRScanner(false)
      toast.success('Address scanned successfully!')
    }
  }

  const handleNetworkChange = (newNetwork) => {
    setNetwork(newNetwork)
    setSendForm({ to: '', amount: '', gasLimit: '300000' })
    
    // Auto-enable contract mode for Somnia testnet
    const shouldUseContract = currentBlockchain === 'somnia' && newNetwork === 'testnet' && WALLET_MANAGER_ADDRESS
    setUseContract(shouldUseContract)
  }

  const openFaucet = () => {
    const networkConfig = getNetworkConfig(currentBlockchain, network)
    if (networkConfig?.faucetUrl) {
      window.open(networkConfig.faucetUrl, '_blank')
    } else {
      toast.error('No faucet available for this network')
    }
  }

  const openExplorer = () => {
    const networkConfig = getNetworkConfig(currentBlockchain, network)
    if (networkConfig?.explorerUrl) {
      window.open(`${networkConfig.explorerUrl}/address/${walletData.publicKey}`, '_blank')
    }
  }

  if (!blockchainConfig) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-white mb-4">Unsupported Blockchain</h2>
          <p className="text-gray-400">The blockchain "{currentBlockchain}" is not supported.</p>
        </div>
      </div>
    )
  }

  const isTestnet = network !== 'mainnet'

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 space-y-6 md:space-y-8">
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
                  onClick={openExplorer}
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
                title="Auto-refreshes every 30 seconds"
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

      {/* Send Transaction Form */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-75"></div>
        <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="relative inline-block overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <div className="inline-flex items-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 justify-center bg-neutral-950 backdrop-blur-3xl">
                <Send className="text-purple-400" size={20} />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white font-geist">Send {blockchainConfig.symbol}</h2>
          </div>

          <form onSubmit={handleSendTransaction} className="space-y-6">
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
                  </label>
                  <input
                    type="number"
                    min={useContract ? "300000" : "21000"}
                    value={sendForm.gasLimit}
                    onChange={(e) => handleInputChange('gasLimit', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-neutral-800/50 text-gray-200 placeholder-gray-400 transition-all duration-200 hover:border-neutral-500"
                  />
                  <p className="text-xs text-gray-400 mt-2 font-geist">
                    {useContract ? 'Contract interactions: 300,000' : 'Standard transfers: 21,000'}
                  </p>
                </div>
              </div>
            </div>

            {!isTestnet && (
              <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-red-400 mt-0.5" size={16} />
                  <div className="text-sm text-red-300">
                    <p className="font-medium">Mainnet Transaction</p>
                    <p>This transaction will be sent on {currentNetworkConfig?.name} using real {blockchainConfig.symbol}. Double-check all details before proceeding.</p>
                  </div>
                </div>
              </div>
            )}

            {isTestnet && (
              <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-yellow-400 mt-0.5" size={16} />
                  <div className="text-sm text-yellow-300">
                    <p className="font-medium">Testnet Transaction</p>
                    <p>This transaction will be sent on {currentNetworkConfig?.name}. Make sure you have testnet {blockchainConfig.symbol} for gas fees.</p>
                  </div>
                </div>
              </div>
            )}

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
                        <span>{transactionStatus || 'Sending Transaction...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send {blockchainConfig.symbol}</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </span>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      <EVMTransactionHistory
        walletAddress={walletData.publicKey}
        blockchain={blockchain}
        network={network}
        useContract={useContract}
      />

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showQRScanner}
        onClose={handleCloseQRScanner}
        onScanResult={handleQRScanResult}
      />
    </div>
  )
}

export default EVMTransaction