/**
 * Escrow Utilities Module
 * Helper functions for escrow status, formatting, and UI support
 */

import { EscrowStatus } from './contractConfig'

/**
 * Get escrow status text
 * @param {number} status - Status number
 * @returns {string} Status text
 */
export const getEscrowStatusText = (status) => {
    switch (status) {
        case EscrowStatus.PENDING:
            return 'Pending'
        case EscrowStatus.CLAIMED:
            return 'Claimed'
        case EscrowStatus.REFUNDED:
            return 'Refunded'
        default:
            return 'Unknown'
    }
}

/**
 * Get escrow status color for UI
 * @param {number} status - Status number
 * @returns {string} CSS color class
 */
export const getEscrowStatusColor = (status) => {
    switch (status) {
        case EscrowStatus.PENDING:
            return 'text-yellow-400 bg-yellow-600/20 border-yellow-600/30'
        case EscrowStatus.CLAIMED:
            return 'text-green-400 bg-green-600/20 border-green-600/30'
        case EscrowStatus.REFUNDED:
            return 'text-red-400 bg-red-600/20 border-red-600/30'
        default:
            return 'text-gray-400 bg-gray-600/20 border-gray-600/30'
    }
}

/**
 * Format timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date
 */
export const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === 0) return 'N/A'
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

/**
 * Validate escrow creation parameters
 * @param {string} receiver - Receiver address
 * @param {string} amount - Amount in ETH
 * @param {string} senderAddress - Sender address
 * @returns {Promise<Object>} Validation result with isValid and error message
 */
export const validateEscrowParams = async (receiver, amount, senderAddress) => {
    try {
        // Import ethers dynamically to avoid circular dependencies
        const { ethers } = await import('ethers')
        
        // Check for self-escrow
        if (receiver.toLowerCase() === senderAddress.toLowerCase()) {
            return {
                isValid: false,
                error: "Cannot create escrow to yourself"
            }
        }
        
        // Check for zero address
        if (receiver === ethers.ZeroAddress || receiver === '0x0000000000000000000000000000000000000000') {
            return {
                isValid: false,
                error: "Cannot create escrow to zero address"
            }
        }
        
        // Validate address format
        if (!ethers.isAddress(receiver)) {
            return {
                isValid: false,
                error: "Invalid receiver address format"
            }
        }
        
        // Validate amount
        const amountFloat = parseFloat(amount)
        if (isNaN(amountFloat) || amountFloat <= 0) {
            return {
                isValid: false,
                error: "Amount must be greater than 0"
            }
        }
        
        // Check minimum escrow amount (0.001 ETH)
        // if (amountFloat < 0.001) {
        //     return {
        //         isValid: false,
        //         error: "Minimum escrow amount is 0.001 ETH"
        //     }
        // }
        
        return {
            isValid: true,
            error: null
        }
    } catch (error) {
        return {
            isValid: false,
            error: `Validation error: ${error.message}`
        }
    }
}

/**
 * Validate sufficient balance for escrow creation with dynamic gas estimation
 * @param {string} balance - Current balance in ETH
 * @param {string} amount - Amount to escrow in ETH
 * @param {number} estimatedGas - Estimated gas for the transaction
 * @param {string} gasPrice - Current gas price in wei (optional)
 * @returns {Object} Validation result with isValid and error message
 */
export const validateSufficientBalance = (balance, amount, estimatedGas = 300000, gasPrice = '6000000000') => {
    try {
        const balanceFloat = parseFloat(balance)
        const amountFloat = parseFloat(amount)
        
        // Calculate estimated gas fee in ETH
        const gasPriceGwei = parseFloat(gasPrice) / 1e9 // Convert wei to gwei
        const estimatedGasFeeEth = (estimatedGas * parseFloat(gasPrice)) / 1e18
        
        // Add 20% safety margin to account for gas price fluctuations
        const totalRequired = amountFloat + (estimatedGasFeeEth * 1.2)
        
        console.log('Balance validation:', {
            balance: balanceFloat,
            amount: amountFloat,
            estimatedGas,
            gasPriceGwei: `${gasPriceGwei} gwei`,
            estimatedGasFeeEth: estimatedGasFeeEth.toFixed(6),
            totalRequired: totalRequired.toFixed(6)
        })
        
        if (balanceFloat < totalRequired) {
            return {
                isValid: false,
                error: `Insufficient balance. Required: ${totalRequired.toFixed(6)} ETH (${amountFloat} ETH + ~${estimatedGasFeeEth.toFixed(6)} ETH gas), Available: ${balanceFloat.toFixed(6)} ETH`
            }
        }
        
        return {
            isValid: true,
            error: null
        }
    } catch (error) {
        return {
            isValid: false,
            error: `Balance validation error: ${error.message}`
        }
    }
}

/**
 * Calculate gas estimation with intelligent fallback and dynamic cap
 * @param {ethers.Contract} contract - Contract instance
 * @param {string} method - Method name
 * @param {Array} params - Method parameters
 * @param {Object} txOptions - Transaction options
 * @param {number} preferredGasCap - Preferred gas limit from frontend (default: 300000)
 * @returns {Promise<number>} Gas estimate
 */
export const estimateGasWithFallback = async (contract, method, params, txOptions = {}, preferredGasCap = 300000) => {
    try {
        console.log(`Estimating gas for ${method} with params:`, params, txOptions)
        
        // Try to estimate gas
        const estimatedGas = await contract[method].estimateGas(...params, txOptions)
        const gasLimit = Number(estimatedGas)
        
        console.log(`Gas estimation for ${method}: ${gasLimit}`)
        
        // Dynamic cap based on estimated gas
        let dynamicCap = preferredGasCap
        
        // If estimated gas is significantly higher than preferred cap,
        // use a more reasonable cap based on the estimation
        if (gasLimit > preferredGasCap * 2) {
            // Use estimated gas + 20% buffer, but cap at 5M gas to prevent excessive fees
            dynamicCap = Math.min(Math.floor(gasLimit * 1.2), 5000000)
            console.log(`⚠️ Gas estimation ${gasLimit} significantly exceeds preferred cap ${preferredGasCap}.`)
            console.log(`⚙️ Using dynamic cap: ${dynamicCap} (${((dynamicCap/gasLimit-1)*100).toFixed(1)}% buffer)`)
        } else if (gasLimit > preferredGasCap) {
            // If only slightly over, use estimated gas + 10% buffer
            dynamicCap = Math.floor(gasLimit * 1.1)
            console.log(`⚠️ Gas estimation ${gasLimit} exceeds preferred cap ${preferredGasCap}.`)
            console.log(`⚙️ Using adjusted cap: ${dynamicCap} (${((dynamicCap/gasLimit-1)*100).toFixed(1)}% buffer)`)
        } else {
            // If within preferred range, add 20% buffer
            dynamicCap = Math.max(Math.floor(gasLimit * 1.2), preferredGasCap)
            console.log(`✅ Using preferred cap with buffer: ${dynamicCap} (${((dynamicCap/gasLimit-1)*100).toFixed(1)}% buffer)`)
        }
        
        return dynamicCap
    } catch (error) {
        console.warn(`Gas estimation failed for ${method}:`, error)
        
        // Fallback strategy based on method type
        let fallbackGas
        if (method === 'createEscrow') {
            // Escrow creation typically needs more gas
            fallbackGas = 500000
        } else if (method === 'claim' || method === 'refund') {
            // Claim/refund operations are simpler
            fallbackGas = 200000
        } else {
            // Default fallback
            fallbackGas = preferredGasCap
        }
        
        console.log(`Using fallback gas limit for ${method}: ${fallbackGas}`)
        return fallbackGas
    }
}

/**
 * Enhanced error handler for contract operations
 * @param {Error} error - The error object
 * @param {string} operation - The operation that failed
 * @returns {string} User-friendly error message
 */
export const handleContractError = (error, operation) => {
    console.error(`Contract ${operation} error:`, error)
    
    // Common error patterns and user-friendly messages
    if (error.message.includes('insufficient funds')) {
        return 'Insufficient funds for this transaction'
    }
    
    if (error.message.includes('user rejected')) {
        return 'Transaction was rejected by user'
    }
    
    if (error.message.includes('gas')) {
        return 'Transaction failed due to gas issues. Please try again with higher gas limit.'
    }
    
    if (error.message.includes('revert')) {
        return 'Transaction was reverted by the contract. Please check the transaction parameters.'
    }
    
    if (error.message.includes('network')) {
        return 'Network connection error. Please check your internet connection and try again.'
    }
    
    if (error.message.includes('nonce')) {
        return 'Transaction nonce error. Please try again.'
    }
    
    // Return original error message if no pattern matches
    return error.message || `Failed to ${operation}`
}

/**
 * Wait for transaction with enhanced error handling
 * @param {ethers.TransactionResponse} tx - Transaction response
 * @param {number} confirmations - Number of confirmations to wait for
 * @param {string} operation - Operation description for error messages
 * @returns {Promise<ethers.TransactionReceipt>} Transaction receipt
 */
export const waitForTransactionWithRetry = async (tx, confirmations = 1, operation = 'transaction') => {
    try {
        console.log(`Waiting for ${operation} confirmation...`)
        
        if (tx.wait && typeof tx.wait === 'function') {
            const receipt = await tx.wait(confirmations)
            console.log(`${operation} confirmed in block:`, receipt.blockNumber)
            return receipt
        } else {
            throw new Error('Transaction object does not have a wait method')
        }
    } catch (error) {
        const errorMessage = handleContractError(error, operation)
        console.error(`Error waiting for ${operation}:`, error)
        throw new Error(errorMessage)
    }
}