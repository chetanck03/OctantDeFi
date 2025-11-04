// Test file for WalletX Escrow functionality
// This file can be used to test the escrow contract integration

import { 
  createEscrow,
  claimEscrow,
  refundEscrow,
  getEscrowTransactionHistory,
  getPendingActions,
  getEscrowDetails,
  getEscrowCount,
  WALLETX_CONTRACT_ADDRESS 
} from './contractUtils'
import { getNetworkConfig } from './networks'

/**
 * Test escrow contract functionality
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} senderPrivateKey - Sender's private key
 * @param {string} receiverAddress - Receiver's address
 * @param {string} amount - Amount to escrow in ETH
 */
export const testEscrowFlow = async (blockchain, network, senderPrivateKey, receiverAddress, amount) => {
  console.log('🧪 Starting WalletX Escrow Test Flow...')
  
  try {
    // Check if contract is configured
    if (!WALLETX_CONTRACT_ADDRESS || WALLETX_CONTRACT_ADDRESS === "0xYourWalletXContractAddress") {
      throw new Error('WalletX contract address not configured. Please deploy the contract and update .env')
    }

    console.log('📋 Contract Address:', WALLETX_CONTRACT_ADDRESS)

    // Step 1: Get initial escrow count
    console.log('\n1️⃣ Getting initial escrow count...')
    const initialCount = await getEscrowCount(blockchain, network)
    console.log('Initial escrow count:', initialCount)

    // Step 2: Create escrow
    console.log('\n2️⃣ Creating escrow...')
    const createTx = await createEscrow(blockchain, network, senderPrivateKey, receiverAddress, amount)
    console.log('Escrow creation transaction:', createTx.hash)
    
    // Wait for confirmation
    let receipt;
    try {
      // Use the wait method from createTx, which is properly implemented in contractUtils.js
      receipt = await createTx.wait(1);
      console.log('Escrow created in block:', receipt.blockNumber);
    } catch (waitError) {
      console.warn('Error waiting for transaction:', waitError);
      console.log('Transaction hash:', createTx.hash);
    }
    console.log('Escrow ID:', createTx.escrowId)

    // Step 3: Get escrow details
    console.log('\n3️⃣ Getting escrow details...')
    const escrowDetails = await getEscrowDetails(blockchain, network, createTx.escrowId)
    console.log('Escrow details:', escrowDetails)

    // Step 4: Check pending actions for receiver
    console.log('\n4️⃣ Checking pending actions for receiver...')
    const receiverActions = await getPendingActions(blockchain, network, receiverAddress)
    console.log('Receiver pending actions:', receiverActions)

    // Step 5: Get transaction history
    console.log('\n5️⃣ Getting transaction history...')
    const senderWallet = new (await import('ethers')).ethers.Wallet(senderPrivateKey)
    const senderAddress = senderWallet.address
    
    const senderHistory = await getEscrowTransactionHistory(blockchain, network, senderAddress)
    const receiverHistory = await getEscrowTransactionHistory(blockchain, network, receiverAddress)
    
    console.log('Sender history:', senderHistory)
    console.log('Receiver history:', receiverHistory)

    console.log('\n✅ Escrow test flow completed successfully!')
    
    return {
      success: true,
      escrowId: createTx.escrowId,
      transactionHash: createTx.hash,
      escrowDetails,
      receiverActions,
      senderHistory,
      receiverHistory
    }

  } catch (error) {
    console.error('❌ Escrow test failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Test claim functionality
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} receiverPrivateKey - Receiver's private key
 * @param {string} escrowId - Escrow ID to claim
 */
export const testClaimEscrow = async (blockchain, network, receiverPrivateKey, escrowId) => {
  console.log('🧪 Testing escrow claim...')
  
  try {
    // Claim the escrow
    const claimTx = await claimEscrow(blockchain, network, receiverPrivateKey, escrowId)
    console.log('Claim transaction:', claimTx.hash)
    
    const receipt = await claimTx.wait()
    console.log('Escrow claimed in block:', receipt.blockNumber)

    // Get updated escrow details
    const updatedDetails = await getEscrowDetails(blockchain, network, escrowId)
    console.log('Updated escrow details:', updatedDetails)

    console.log('✅ Claim test completed successfully!')
    
    return {
      success: true,
      transactionHash: claimTx.hash,
      updatedDetails
    }

  } catch (error) {
    console.error('❌ Claim test failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Test refund functionality
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} senderPrivateKey - Sender's private key
 * @param {string} escrowId - Escrow ID to refund
 */
export const testRefundEscrow = async (blockchain, network, senderPrivateKey, escrowId) => {
  console.log('🧪 Testing escrow refund...')
  
  try {
    // Refund the escrow
    const refundTx = await refundEscrow(blockchain, network, senderPrivateKey, escrowId)
    console.log('Refund transaction:', refundTx.hash)
    
    const receipt = await refundTx.wait()
    console.log('Escrow refunded in block:', receipt.blockNumber)

    // Get updated escrow details
    const updatedDetails = await getEscrowDetails(blockchain, network, escrowId)
    console.log('Updated escrow details:', updatedDetails)

    console.log('✅ Refund test completed successfully!')
    
    return {
      success: true,
      transactionHash: refundTx.hash,
      updatedDetails
    }

  } catch (error) {
    console.error('❌ Refund test failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Quick contract connectivity test
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 */
export const testContractConnectivity = async (blockchain, network) => {
  console.log('🔌 Testing WalletX contract connectivity...')
  
  try {
    // Test basic contract read function
    const escrowCount = await getEscrowCount(blockchain, network)
    console.log('✅ Contract is accessible! Total escrows:', escrowCount)
    
    return {
      success: true,
      escrowCount,
      contractAddress: WALLETX_CONTRACT_ADDRESS
    }

  } catch (error) {
    console.error('❌ Contract connectivity test failed:', error)
    return {
      success: false,
      error: error.message,
      contractAddress: WALLETX_CONTRACT_ADDRESS
    }
  }
}

// Export test functions for use in browser console or components
window.walletXTests = {
  testEscrowFlow,
  testClaimEscrow,
  testRefundEscrow,
  testContractConnectivity
}

console.log('🧪 WalletX Escrow Tests loaded! Use window.walletXTests to run tests.')