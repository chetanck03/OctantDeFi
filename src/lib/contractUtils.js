/**
 * WalletX Contract Utilities - Modular Import/Export
 * Main entry point for all contract-related functionality
 * This file now imports from specialized modules for better maintainability
 */

// Configuration and contract setup
export {
    WALLETX_ABI,
    EscrowStatus,
    getWalletXContract,
    getWalletXContractAddress,
    validateContractConnectivity
} from './contractConfig'

// Export legacy name for backward compatibility
export { getWalletXContractAddress as WALLETX_CONTRACT_ADDRESS } from './contractConfig'

// Contract operations (create, claim, refund)
export {
    createEscrow,
    claimEscrow,
    refundEscrow,
    debugEscrow
} from './contractOperations'

// Contract data fetching
export {
    getUserSentEscrows,
    getUserReceivedEscrows,
    getPendingActions,
    getEscrowDetails,
    getEscrowCount,
    getComprehensiveEscrowData
} from './contractData'

// Storage management
export {
    storeEscrowTransaction,
    updateEscrowStatus,
    getEscrowTransactionHistory,
    getEscrowTransactionHistoryWithRealTimeStatus,
    debugEscrowTransactions,
    clearEscrowHistory
} from './escrowStorage'

// Utility functions
export {
    getEscrowStatusText,
    getEscrowStatusColor,
    formatTimestamp,
    validateEscrowParams,
    validateSufficientBalance,
    estimateGasWithFallback,
    handleContractError,
    waitForTransactionWithRetry
} from './escrowUtils'

// Legacy exports for backward compatibility
export const WALLET_MANAGER_ADDRESS = () => {
    console.warn('WALLET_MANAGER_ADDRESS is deprecated, use getWalletXContractAddress() instead')
    const { getWalletXContractAddress } = require('./contractConfig')
    return getWalletXContractAddress()
}

// Legacy function redirects
export const getContractTransactionHistory = async (blockchain, network, address, limit = 50) => {
    console.warn('getContractTransactionHistory is deprecated, use getEscrowTransactionHistory instead')
    const { getEscrowTransactionHistory } = await import('./escrowStorage')
    return getEscrowTransactionHistory(blockchain, network, address, limit)
}

export const getContractWalletBalance = async (blockchain, network, address) => {
    console.warn('getContractWalletBalance is deprecated, use getEVMBalance instead')
    const { getEVMBalance } = await import('./evmWalletUtils')
    return getEVMBalance(blockchain, network, address)
}

export const sendETHThroughContract = async (blockchain, network, privateKey, to, amount, gasLimit = '300000') => {
    console.warn('sendETHThroughContract is deprecated, use sendEVMTransaction instead')
    const { sendEVMTransaction } = await import('./evmWalletUtils')
    return sendEVMTransaction(blockchain, network, privateKey, to, amount, gasLimit)
}