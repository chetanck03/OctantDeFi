import React, { useState, useEffect } from 'react'
import { ExternalLink, ArrowUpRight, ArrowDownLeft, RefreshCw, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { getNetworkConfig, getBlockchainConfig } from '../../lib/networks'
import { getContractTransactionHistory } from '../../lib/contractUtils'

function EVMTransactionHistory({ walletAddress, blockchain, network, useContract = false }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      if (useContract) {
        await fetchContractTransactions()
      } else {
        await fetchEVMTransactions()
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Failed to fetch transaction history')
    } finally {
      setLoading(false)
    }
  }

  const fetchContractTransactions = async () => {
    try {
      const contractTxs = await getContractTransactionHistory(blockchain, network, walletAddress, 50)
      
      // Format contract transactions to match the expected format
      const formattedTxs = contractTxs.map(tx => ({
        hash: tx.hash, // This should now be the real blockchain transaction hash
        from: tx.from,
        to: tx.to,
        value: parseFloat(tx.amount),
        asset: getBlockchainConfig(blockchain)?.symbol || 'ETH',
        tokenSymbol: getBlockchainConfig(blockchain)?.symbol || 'ETH',
        timestamp: tx.timestamp * 1000, // Convert to milliseconds
        type: tx.isIncoming ? 'received' : 'sent',
        status: 'confirmed',
        blockNumber: 0, // Contract doesn't store block numbers
        category: 'contract'
      }))
      
      setTransactions(formattedTxs.sort((a, b) => b.timestamp - a.timestamp))
    } catch (error) {
      console.error('Error fetching contract transactions:', error)
      // If contract transaction history fails, show a helpful message
      setTransactions([{
        hash: 'contract-mode-info',
        from: 'Smart Contract',
        to: 'Transaction History',
        value: 0,
        asset: getBlockchainConfig(blockchain)?.symbol || 'ETH',
        tokenSymbol: getBlockchainConfig(blockchain)?.symbol || 'ETH',
        timestamp: Date.now(),
        type: 'info',
        status: 'info',
        blockNumber: 0,
        category: 'info',
        isPlaceholder: true,
        isContractMode: true
      }])
    }
  }

  const fetchBasicTransactions = async (rpcUrl, blockchainConfig) => {
    try {
      // For public RPCs, we can't get detailed transaction history easily
      // But we can try to get recent transactions using eth_getTransactionCount
      // and show a helpful message to users
      
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'eth_getTransactionCount',
          params: [walletAddress, 'latest']
        })
      })

      const data = await response.json()
      
      if (data.result) {
        const txCount = parseInt(data.result, 16)
        console.log(`Wallet has ${txCount} transactions`)
        
        if (txCount > 0) {
          // Create a helpful info card showing transaction count and explorer link
          setTransactions([{
            hash: 'view-on-explorer',
            from: 'Public RPC',
            to: 'Limited Access',
            value: 0,
            asset: blockchainConfig?.symbol || 'ETH',
            tokenSymbol: blockchainConfig?.symbol || 'ETH',
            timestamp: Date.now(),
            type: 'info',
            status: 'info',
            blockNumber: 0,
            category: 'info',
            isPlaceholder: true,
            txCount: txCount
          }])
        } else {
          setTransactions([])
        }
      } else {
        setTransactions([])
      }
    } catch (error) {
      console.error('Error in basic transaction fetching:', error)
      setTransactions([])
    }
  }

  const fetchEVMTransactions = async () => {
    try {
      // Get the network configuration for the current blockchain and network
      const networkConfig = getNetworkConfig(blockchain, network)
      const blockchainConfig = getBlockchainConfig(blockchain)

      if (!networkConfig || !networkConfig.rpcUrl) {
        console.error('No RPC URL found for', blockchain, network)
        setTransactions([])
        return
      }

      const rpcUrl = networkConfig.rpcUrl

      // Check if this is an Alchemy RPC (supports alchemy_getAssetTransfers)
      const isAlchemyRPC = rpcUrl.includes('alchemy.com')
      
      if (!isAlchemyRPC) {
        // For non-Alchemy RPCs (like BNB public endpoints), try basic transaction fetching
        console.warn(`Using basic transaction fetching for ${blockchain} on ${network} - public RPC`)
        await fetchBasicTransactions(rpcUrl, blockchainConfig)
        return
      }

      // For EVM networks, use only 'external' category to avoid API errors
      // Base, Polygon, Avalanche, BNB Smart Chain don't support 'internal' category
      const [sentResponse, receivedResponse] = await Promise.all([
        // Sent transactions
        fetch(`${rpcUrl}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: 1,
            jsonrpc: '2.0',
            method: 'alchemy_getAssetTransfers',
            params: [{
              fromBlock: '0x0',
              toBlock: 'latest',
              fromAddress: walletAddress,
              category: ['external'], // Only external transactions for EVM networks
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: '0x14'
            }]
          })
        }),
        // Received transactions
        fetch(`${rpcUrl}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: 2,
            jsonrpc: '2.0',
            method: 'alchemy_getAssetTransfers',
            params: [{
              fromBlock: '0x0',
              toBlock: 'latest',
              toAddress: walletAddress,
              category: ['external'], // Only external transactions for EVM networks
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: '0x14'
            }]
          })
        })
      ])

      const [sentData, receivedData] = await Promise.all([
        sentResponse.json(),
        receivedResponse.json()
      ])

      // Simple error handling
      if (sentData.error || receivedData.error) {
        console.error('Transaction API error:', sentData.error || receivedData.error)
        setTransactions([])
        return
      }

      const allTransfers = []

      // Process sent transactions
      if (sentData.result && sentData.result.transfers) {
        sentData.result.transfers.forEach(tx => {
          allTransfers.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: parseFloat(tx.value || 0),
            asset: tx.asset || blockchainConfig?.symbol || 'ETH',
            tokenSymbol: tx.asset || blockchainConfig?.symbol || 'ETH',
            timestamp: new Date(tx.metadata.blockTimestamp).getTime(),
            type: 'sent',
            status: 'confirmed',
            blockNumber: parseInt(tx.blockNum, 16),
            category: tx.category
          })
        })
      }

      // Process received transactions
      if (receivedData.result && receivedData.result.transfers) {
        receivedData.result.transfers.forEach(tx => {
          allTransfers.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: parseFloat(tx.value || 0),
            asset: tx.asset || blockchainConfig?.symbol || 'ETH',
            tokenSymbol: tx.asset || blockchainConfig?.symbol || 'ETH',
            timestamp: new Date(tx.metadata.blockTimestamp).getTime(),
            type: 'received',
            status: 'confirmed',
            blockNumber: parseInt(tx.blockNum, 16),
            category: tx.category
          })
        })
      }

      // Remove duplicates and sort by timestamp
      const uniqueTransactions = allTransfers.filter((tx, index, self) =>
        index === self.findIndex(t => t.hash === tx.hash && t.from === tx.from && t.to === tx.to)
      )

      setTransactions(uniqueTransactions.sort((a, b) => b.timestamp - a.timestamp))
    } catch (error) {
      console.error(`Error fetching ${blockchain} transactions:`, error)
      setTransactions([])
    }
  }

  useEffect(() => {
    if (walletAddress) {
      fetchTransactions()
    }
  }, [walletAddress, blockchain, network, useContract])

  // Listen for transaction completion events to auto-refresh
  useEffect(() => {
    const handleTransactionCompleted = (event) => {
      const { blockchain: eventBlockchain } = event.detail

      // Only refresh if the event is for the current blockchain
      if (eventBlockchain === blockchain) {
        // Refresh immediately for contract transactions since we store them locally
        if (useContract) {
          fetchTransactions()
        } else {
          // Add a small delay for RPC transactions to allow indexing
          setTimeout(() => {
            fetchTransactions()
          }, 2000)
        }
      }
    }

    window.addEventListener('transactionCompleted', handleTransactionCompleted)

    return () => {
      window.removeEventListener('transactionCompleted', handleTransactionCompleted)
    }
  }, [blockchain, useContract])

  const openExplorer = (hashOrType) => {
    const networkConfig = getNetworkConfig(blockchain, network)

    if (!networkConfig || !networkConfig.explorerUrl) {
      toast.error('Explorer not available for this network')
      return
    }

    let explorerUrl
    if (hashOrType === 'address') {
      explorerUrl = `${networkConfig.explorerUrl}/address/${walletAddress}`
    } else {
      explorerUrl = `${networkConfig.explorerUrl}/tx/${hashOrType}`
    }
    
    window.open(explorerUrl, '_blank')
  }

  const formatValue = (value, tokenSymbol = null) => {
    if (value === 0) return '0'

    const blockchainConfig = getBlockchainConfig(blockchain)
    const symbol = tokenSymbol || blockchainConfig?.symbol || 'TOKEN'

    // Format based on value size - avoid scientific notation
    if (value >= 1) {
      return `${value.toFixed(4)} ${symbol}`
    } else if (value >= 0.001) {
      return `${value.toFixed(6)} ${symbol}`
    } else if (value >= 0.000001) {
      return `${value.toFixed(8)} ${symbol}`
    } else if (value >= 0.000000001) {
      return `${value.toFixed(12)} ${symbol}`
    } else {
      // For extremely small values, show with appropriate decimal places
      return `${value.toFixed(18)} ${symbol}`
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-75"></div>
      <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="relative inline-block overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]  bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <div className="inline-flex items-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 justify-center bg-neutral-950 backdrop-blur-3xl">
                <Clock className="text-purple-400" size={20} />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white font-geist">Transaction History</h2>
          </div>
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-600/30 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium min-w-[100px] justify-center"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
            <span className="sm:inline">Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="relative inline-block overflow-hidden rounded-full p-[2px] mb-6">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]  bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 bg-neutral-950 backdrop-blur-3xl">
                <RefreshCw className="animate-spin text-purple-400" size={32} />
              </div>
            </div>
            <p className="text-lg text-gray-300 font-geist">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative inline-block overflow-hidden rounded-full p-[2px] mb-6">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]  bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20  bg-neutral-950 backdrop-blur-3xl">
                <Clock className="text-gray-400" size={32} />
              </div>
            </div>
            <p className="text-lg text-gray-300 font-geist mb-2">No transactions found</p>
            <p className="text-sm text-gray-400">
              Transactions will appear here once you send or receive {getBlockchainConfig(blockchain)?.symbol || 'tokens'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {transactions.map((tx, index) => {
              // Handle placeholder transaction for non-Alchemy RPCs or contract mode
              if (tx.isPlaceholder) {
                const isContractMode = tx.isContractMode
                const borderColor = isContractMode ? 'border-green-600/30' : 'border-blue-600/30'
                const bgColor = isContractMode ? 'bg-green-600/10' : 'bg-blue-600/10'
                const iconColor = isContractMode ? 'bg-green-600/20 text-green-400 border-green-600/30' : 'bg-blue-600/20 text-blue-400 border-blue-600/30'
                const textColor = isContractMode ? 'text-green-300' : 'text-blue-300'
                const subTextColor = isContractMode ? 'text-green-400/80' : 'text-blue-400/80'
                const buttonColor = isContractMode ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 border-green-600/30' : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border-blue-600/30'
                
                return (
                  <div key={tx.hash || index} className="relative">
                    <div className={`relative flex flex-col p-4 sm:p-5 border ${borderColor} rounded-xl ${bgColor} gap-4`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 sm:p-3 rounded-full ${iconColor}`}>
                          <ExternalLink size={16} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${textColor} text-sm sm:text-base`}>
                            {isContractMode 
                              ? 'Smart Contract Mode Active'
                              : tx.txCount > 0 
                                ? `${tx.txCount} Transaction${tx.txCount !== 1 ? 's' : ''} Found` 
                                : 'Transaction History'
                            }
                          </h3>
                          <p className={`text-xs sm:text-sm ${subTextColor}`}>
                            {isContractMode
                              ? 'New transactions will appear here after using the smart contract'
                              : tx.txCount > 0 
                                ? 'View detailed transaction history on the block explorer'
                                : 'Transaction history will appear here after your first transaction'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => openExplorer('address')}
                          className={`flex items-center gap-2 px-4 py-2.5 ${buttonColor} rounded-lg transition-colors text-sm font-medium`}
                        >
                          <ExternalLink size={14} />
                          View on Explorer
                        </button>
                      </div>
                      
                      <div className={`text-xs ${isContractMode ? 'text-green-400/60 bg-green-600/5 border-green-600/20' : 'text-blue-400/60 bg-blue-600/5 border-blue-600/20'} p-3 rounded-lg border`}>
                        <p className="mb-2"><strong>About {isContractMode ? 'Smart Contract' : 'Transaction'} History:</strong></p>
                        {isContractMode ? (
                          <>
                            <p>• All transactions go through your deployed smart contract</p>
                            <p>• Transaction hashes link directly to Somnia Explorer for verification</p>
                            <p>• Complete transaction history is stored on-chain</p>
                          </>
                        ) : (
                          <>
                            <p>• Somnia uses public RPC endpoints for optimal performance</p>
                            <p>• Detailed transaction history is available on Somnia Explorer</p>
                            <p>• New transactions will trigger automatic balance updates</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={tx.hash || index}
                  className="group relative cursor-pointer"
                  onClick={() => openExplorer(tx.hash)}
                >
              
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 to-green-400/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border border-neutral-600 rounded-xl bg-neutral-800/30 hover:bg-neutral-800/50 hover:border-neutral-500 transition-all duration-300 hover:shadow-lg gap-3 sm:gap-0">

                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                    <div className="relative flex-shrink-0">
                      <div className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 ${
                        tx.type === 'sent'
                          ? 'bg-red-600/20 text-red-400 border border-red-600/30 group-hover:bg-red-600/30 group-hover:border-red-500/50'
                          : tx.type === 'received'
                          ? 'bg-green-600/20 text-green-400 border border-green-600/30 group-hover:bg-green-600/30 group-hover:border-green-500/50'
                          : 'bg-blue-600/20 text-blue-400 border border-blue-600/30 group-hover:bg-blue-600/30 group-hover:border-blue-500/50'
                      }`}>
                        {tx.type === 'sent' ? (
                          <ArrowUpRight size={16} />
                        ) : tx.type === 'received' ? (
                          <ArrowDownLeft size={16} />
                        ) : (
                          <ExternalLink size={16} />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="font-semibold text-white capitalize font-geist text-sm sm:text-base">
                          {tx.type === 'unknown' ? 'Transaction' : tx.type}
                        </p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                          tx.status === 'confirmed'
                            ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                            : 'bg-red-600/20 text-red-400 border border-red-600/30'
                        }`}>
                          {tx.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-300 mb-2">
                        <span className="font-geist">{formatDate(tx.timestamp)}</span>
                        <span className="text-gray-500">•</span>
                        <span className="font-mono text-xs bg-neutral-700/50 px-2 py-1 rounded-md border border-neutral-600/30 break-all">
                          {tx.hash?.slice(0, 6)}...{tx.hash?.slice(-4)}
                        </span>
                      </div>

                      {tx.value > 0 && (tx.from !== 'Unknown' || tx.to !== 'Unknown') && (
                        <div className="text-xs text-gray-400">
                          <span className="font-geist">{tx.type === 'sent' ? 'To: ' : 'From: '}</span>
                          <span className="font-mono bg-neutral-700/30 px-1.5 py-0.5 rounded border border-neutral-600/20 break-all">
                            {tx.type === 'sent'
                              ? `${tx.to?.slice(0, 4)}...${tx.to?.slice(-3)}`
                              : `${tx.from?.slice(0, 4)}...${tx.from?.slice(-3)}`
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      {tx.value > 0 ? (
                        <div>
                          <p className={`font-bold text-base sm:text-lg font-geist break-all ${
                            tx.type === 'sent' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {tx.type === 'sent' ? '-' : '+'}{formatValue(tx.value, tx.tokenSymbol)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 font-geist">
                            {tx.type === 'sent' ? 'Sent' : 'Received'}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-purple-400 font-medium font-geist text-sm sm:text-base">View Details</p>
                          <p className="text-xs text-gray-400 mt-1 font-geist">Click to explore</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors flex-shrink-0">
                      <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  )
}

export default EVMTransactionHistory