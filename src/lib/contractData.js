/**
 * Contract Data Module
 * Functions for reading escrow data and contract state
 */

import { ethers } from "ethers"
import { getWalletXContract, EscrowStatus, validateContractConnectivity } from './contractConfig'
import { getEscrowTransactionHistory } from './escrowStorage'
import { handleContractError } from './escrowUtils'

/**
 * Get user's sent escrows from contract with enhanced error handling
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @returns {Promise<Array>} Array of sent escrow IDs
 */
export const getUserSentEscrows = async (blockchain, network, address) => {
    try {
        console.log(`Fetching sent escrows for ${address} on ${blockchain}:${network}`)
        
        // Validate contract connectivity
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            console.warn("Contract not accessible, returning empty array")
            return []
        }
        
        const contract = getWalletXContract(blockchain, network)
        
        // Validate address format
        if (!ethers.isAddress(address)) {
            throw new Error("Invalid address format")
        }
        
        console.log('Calling contract.getUserSentEscrows with address:', address)
        const escrowIds = await contract.getUserSentEscrows(address)
        console.log('getUserSentEscrows raw result:', escrowIds)
        
        if (!Array.isArray(escrowIds)) {
            console.warn('Unexpected result structure from getUserSentEscrows:', escrowIds)
            return []
        }
        
        const result = escrowIds.map(id => id.toString())
        console.log('Processed sent escrow IDs:', result)
        return result
    } catch (error) {
        const errorMessage = handleContractError(error, 'fetch sent escrows')
        console.error("Error fetching sent escrows:", error)
        // Return empty array instead of throwing to prevent UI crashes
        return []
    }
}

/**
 * Get user's received escrows from contract with enhanced error handling
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @returns {Promise<Array>} Array of received escrow IDs
 */
export const getUserReceivedEscrows = async (blockchain, network, address) => {
    try {
        console.log(`Fetching received escrows for ${address} on ${blockchain}:${network}`)
        
        // Validate contract connectivity
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            console.warn("Contract not accessible, returning empty array")
            return []
        }
        
        const contract = getWalletXContract(blockchain, network)
        
        // Validate address format
        if (!ethers.isAddress(address)) {
            throw new Error("Invalid address format")
        }
        
        console.log('Calling contract.getUserReceivedEscrows with address:', address)
        const escrowIds = await contract.getUserReceivedEscrows(address)
        console.log('getUserReceivedEscrows raw result:', escrowIds)
        
        if (!Array.isArray(escrowIds)) {
            console.warn('Unexpected result structure from getUserReceivedEscrows:', escrowIds)
            return []
        }
        
        const result = escrowIds.map(id => id.toString())
        console.log('Processed received escrow IDs:', result)
        return result
    } catch (error) {
        const errorMessage = handleContractError(error, 'fetch received escrows')
        console.error("Error fetching received escrows:", error)
        // Return empty array instead of throwing to prevent UI crashes
        return []
    }
}

/**
 * Get pending actions for a user with enhanced fallback logic
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @returns {Promise<Object>} Object with claimable and refundable arrays
 */
export const getPendingActions = async (blockchain, network, address) => {
    try {
        console.log(`Fetching pending actions for ${address} on ${blockchain}:${network}`)
        
        // Validate contract connectivity
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            console.warn("Contract not accessible, returning empty pending actions")
            return { claimable: [], refundable: [] }
        }
        
        const contract = getWalletXContract(blockchain, network)
        
        // Validate address format
        if (!ethers.isAddress(address)) {
            throw new Error("Invalid address format")
        }
        
        // Try to get pending actions from contract first
        try {
            console.log('Calling contract.getPendingActions with address:', address)
            const result = await contract.getPendingActions(address)
            console.log('getPendingActions raw result:', result)
            
            // Ensure we have the expected structure
            if (Array.isArray(result) && result.length === 2) {
                const [claimable, refundable] = result
                
                const processedResult = {
                    claimable: claimable.map(id => id.toString()),
                    refundable: refundable.map(id => id.toString())
                }
                
                console.log('Pending actions fetched successfully:', processedResult)
                return processedResult
            } else {
                console.warn('Unexpected result structure from getPendingActions:', result)
                throw new Error('Unexpected result structure from contract')
            }
        } catch (contractError) {
            console.warn("Contract getPendingActions failed, using fallback method:", contractError)
            
            // Fallback: Manually check sent and received escrows
            console.log('Using fallback method to check pending actions')
            const sentIds = await getUserSentEscrows(blockchain, network, address)
            const receivedIds = await getUserReceivedEscrows(blockchain, network, address)
            
            console.log('Fallback - Received escrow IDs:', receivedIds)
            console.log('Fallback - Sent escrow IDs:', sentIds)
            
            const claimable = []
            const refundable = []
            
            // Check each received escrow to see if it's claimable
            for (const id of receivedIds) {
                try {
                    const details = await getEscrowDetails(blockchain, network, id)
                    if (details && details.status === EscrowStatus.PENDING) {
                        claimable.push(id)
                    }
                } catch (e) {
                    console.error(`Error checking received escrow ${id}:`, e)
                }
            }
            
            // Check each sent escrow to see if it's refundable
            for (const id of sentIds) {
                try {
                    const details = await getEscrowDetails(blockchain, network, id)
                    if (details && details.status === EscrowStatus.PENDING) {
                        refundable.push(id)
                    }
                } catch (e) {
                    console.error(`Error checking sent escrow ${id}:`, e)
                }
            }
            
            const fallbackResult = { claimable, refundable }
            console.log('Fallback method results:', fallbackResult)
            return fallbackResult
        }
    } catch (error) {
        const errorMessage = handleContractError(error, 'fetch pending actions')
        console.error("Error fetching pending actions:", error)
        // Return empty arrays instead of throwing to prevent UI crashes
        return { claimable: [], refundable: [] }
    }
}

/**
 * Get detailed escrow information with enhanced error handling
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} escrowId - The escrow ID
 * @returns {Promise<Object|null>} Escrow details or null if not found
 */
export const getEscrowDetails = async (blockchain, network, escrowId) => {
    try {
        console.log(`Fetching escrow details for ID ${escrowId} on ${blockchain}:${network}`)
        
        // Validate contract connectivity
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            console.warn("Contract not accessible, cannot fetch escrow details")
            return null
        }
        
        const contract = getWalletXContract(blockchain, network)
        
        // Validate escrow ID
        if (!escrowId || escrowId === '0') {
            throw new Error("Invalid escrow ID")
        }
        
        const [sender, receiver, amount, status, createdAt, claimedAt, refundedAt] = await contract.getEscrowDetails(escrowId)
        
        const details = {
            escrowId,
            sender,
            receiver,
            amount: ethers.formatEther(amount),
            status: Number(status),
            createdAt: Number(createdAt),
            claimedAt: Number(claimedAt),
            refundedAt: Number(refundedAt)
        }
        
        console.log(`Escrow ${escrowId} details:`, details)
        return details
    } catch (error) {
        const errorMessage = handleContractError(error, 'fetch escrow details')
        console.error(`Error fetching escrow details for ID ${escrowId}:`, error)
        return null
    }
}

/**
 * Get total escrow count from contract
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @returns {Promise<number>} Total escrow count
 */
export const getEscrowCount = async (blockchain, network) => {
    try {
        console.log(`Fetching escrow count on ${blockchain}:${network}`)
        
        // Validate contract connectivity
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            console.warn("Contract not accessible, returning 0 count")
            return 0
        }
        
        const contract = getWalletXContract(blockchain, network)
        const count = await contract.escrowCount()
        const countNumber = Number(count)
        
        console.log(`Total escrow count: ${countNumber}`)
        return countNumber
    } catch (error) {
        const errorMessage = handleContractError(error, 'fetch escrow count')
        console.error("Error fetching escrow count:", error)
        return 0
    }
}

/**
 * Get comprehensive escrow data for a user (combines contract and local storage data)
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {number} limit - Maximum number of transactions
 * @returns {Promise<Object>} Combined escrow data
 */
export const getComprehensiveEscrowData = async (blockchain, network, address, limit = 50) => {
    try {
        console.log(`Fetching comprehensive escrow data for ${address}`)
        
        // Get data in parallel for better performance
        const [
            transactionHistory,
            pendingActions,
            sentEscrows,
            receivedEscrows,
            escrowCount
        ] = await Promise.all([
            getEscrowTransactionHistory(blockchain, network, address, limit),
            getPendingActions(blockchain, network, address),
            getUserSentEscrows(blockchain, network, address),
            getUserReceivedEscrows(blockchain, network, address),
            getEscrowCount(blockchain, network)
        ])
        
        const result = {
            transactionHistory,
            pendingActions,
            sentEscrows,
            receivedEscrows,
            escrowCount,
            lastUpdated: Math.floor(Date.now() / 1000)
        }
        
        console.log(`Comprehensive escrow data for ${address}:`, {
            historyCount: result.transactionHistory.length,
            pendingClaimable: result.pendingActions.claimable.length,
            pendingRefundable: result.pendingActions.refundable.length,
            totalSent: result.sentEscrows.length,
            totalReceived: result.receivedEscrows.length,
            totalEscrows: result.escrowCount
        })
        
        return result
    } catch (error) {
        console.error("Error fetching comprehensive escrow data:", error)
        // Return safe defaults
        return {
            transactionHistory: [],
            pendingActions: { claimable: [], refundable: [] },
            sentEscrows: [],
            receivedEscrows: [],
            escrowCount: 0,
            lastUpdated: Math.floor(Date.now() / 1000),
            error: error.message
        }
    }
}