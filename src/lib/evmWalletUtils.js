import { ethers } from "ethers"
import { generateMnemonic, validateMnemonic } from "bip39"
import { getBlockchainConfig, getNetworkConfig, isEVMCompatible } from './networks'

// Function to create EVM-compatible HD wallet (works for Ethereum, Base, Polygon, Avalanche, BNB Smart Chain)
export const createEVMWallet = (blockchain, mnemonic = null, accountIndex = 0) => {
    try {
        if (!isEVMCompatible(blockchain)) {
            throw new Error(`${blockchain} is not EVM compatible`)
        }

        const blockchainConfig = getBlockchainConfig(blockchain)
        if (!blockchainConfig) {
            throw new Error(`Unsupported blockchain: ${blockchain}`)
        }

        // Generate or use provided mnemonic
        const seedPhrase = mnemonic || generateMnemonic()

        // Derive path for EVM chains (coin type 60)
        const path = `m/44'/${blockchainConfig.coinType}'/${accountIndex}'/0/0`

        // Create HD wallet from mnemonic with specific path
        const derivedWallet = ethers.HDNodeWallet.fromPhrase(seedPhrase, path)

        return {
            seedPhrase,
            publicKey: derivedWallet.address,
            privateKey: derivedWallet.privateKey,
            path,
            blockchain
        }
    } catch (error) {
        console.error(`Error creating ${blockchain} wallet:`, error)
        return null
    }
}

// Function to validate and import seed phrase for EVM chains
export const validateAndImportEVMSeedPhrase = (importedPhrase, blockchain) => {
    try {
        if (!isEVMCompatible(blockchain)) {
            return { success: false, error: `${blockchain} is not EVM compatible` }
        }

        // Validate the seed phrase
        const trimmedPhrase = importedPhrase.trim()
        if (!trimmedPhrase) {
            return { success: false, error: 'Please enter a seed phrase' }
        }

        // Validate using bip39
        if (!validateMnemonic(trimmedPhrase)) {
            return { success: false, error: 'Invalid seed phrase. Please check your words and try again.' }
        }

        // Test if we can create a wallet with this phrase
        const testWallet = createEVMWallet(blockchain, trimmedPhrase, 0)
        if (!testWallet) {
            return { success: false, error: 'Failed to create wallet from seed phrase' }
        }

        return { success: true, seedPhrase: trimmedPhrase }
    } catch (error) {
        console.error('Error importing seed phrase:', error)
        return { success: false, error: 'Invalid seed phrase' }
    }
}

// Function to get provider for any EVM chain
export const getEVMProvider = (blockchain, network = 'mainnet') => {
    try {
        if (!isEVMCompatible(blockchain)) {
            throw new Error(`${blockchain} is not EVM compatible`)
        }

        const networkConfig = getNetworkConfig(blockchain, network)
        if (!networkConfig) {
            throw new Error(`Network ${network} not found for ${blockchain}`)
        }

        const rpcUrl = networkConfig.rpcUrl
        if (!rpcUrl || (!rpcUrl.startsWith('http://') && !rpcUrl.startsWith('https://'))) {
            throw new Error(`Invalid RPC URL for ${blockchain} ${network}: ${rpcUrl}`)
        }

        return new ethers.JsonRpcProvider(rpcUrl)
    } catch (error) {
        console.error(`Error creating provider for ${blockchain}:`, error)
        return null
    }
}

// Function to get balance for any EVM chain
export const getEVMBalance = async (blockchain, network, address) => {
    try {
        const provider = getEVMProvider(blockchain, network)
        if (!provider) {
            throw new Error('Failed to create provider')
        }

        const balanceWei = await provider.getBalance(address)
        const balance = ethers.formatEther(balanceWei)

        return balance
    } catch (error) {
        console.error(`Error fetching balance for ${blockchain}:`, error)
        throw error
    }
}

// Function to send transaction on any EVM chain
export const sendEVMTransaction = async (blockchain, network, privateKey, to, amount, gasLimit = '21000') => {
    try {
        const provider = getEVMProvider(blockchain, network)
        if (!provider) {
            throw new Error('Failed to create provider')
        }

        const wallet = new ethers.Wallet(privateKey, provider)

        // Get current gas price
        const gasPrice = await provider.getFeeData()

        // Create transaction
        const tx = {
            to,
            value: ethers.parseEther(amount),
            gasLimit: parseInt(gasLimit),
            gasPrice: gasPrice.gasPrice
        }

        // Send transaction
        const txResponse = await wallet.sendTransaction(tx)
        return txResponse
    } catch (error) {
        console.error(`Error sending transaction on ${blockchain}:`, error)
        throw error
    }
}

// Local storage utilities for EVM chains
export const saveEVMToLocalStorage = (blockchain, key, value) => {
    try {
        const storageKey = `${blockchain}_${key}`
        localStorage.setItem(storageKey, typeof value === 'string' ? value : JSON.stringify(value))
    } catch (error) {
        console.error(`Error saving to localStorage for ${blockchain}:`, error)
    }
}

export const loadEVMFromLocalStorage = (blockchain, key, defaultValue = null) => {
    try {
        const storageKey = `${blockchain}_${key}`
        const item = localStorage.getItem(storageKey)
        if (!item) return defaultValue

        // Try to parse as JSON, if it fails return as string
        try {
            return JSON.parse(item)
        } catch {
            return item
        }
    } catch (error) {
        console.error(`Error loading from localStorage for ${blockchain}:`, error)
        return defaultValue
    }
}

export const removeEVMFromLocalStorage = (blockchain, key) => {
    try {
        const storageKey = `${blockchain}_${key}`
        localStorage.removeItem(storageKey)
    } catch (error) {
        console.error(`Error removing from localStorage for ${blockchain}:`, error)
    }
}

// Constants for storage keys
export const EVM_STORAGE_KEYS = {
    SEED_PHRASE: 'seed_phrase',
    WALLETS: 'wallets'
}