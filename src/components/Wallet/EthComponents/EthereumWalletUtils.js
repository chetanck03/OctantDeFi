import { ethers } from "ethers"
import { generateMnemonic, validateMnemonic } from "bip39"

// Function to create Ethereum HD wallet
export const createEthereumWallet = (mnemonic = null, accountIndex = 0) => {
    try {
        // Generate or use provided mnemonic
        const seedPhrase = mnemonic || generateMnemonic()

        // Derive path for Ethereum (coin type 60)
        const path = `m/44'/60'/${accountIndex}'/0/0`

        // Create HD wallet from mnemonic with specific path
        const derivedWallet = ethers.HDNodeWallet.fromPhrase(seedPhrase, path)

        return {
            seedPhrase,
            publicKey: derivedWallet.address,
            privateKey: derivedWallet.privateKey,
            path
        }
    } catch (error) {
        console.error('Error creating Ethereum wallet:', error)
        return null
    }
}

// Function to validate and import seed phrase
export const validateAndImportSeedPhrase = (importedPhrase) => {
    try {
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
        const testWallet = createEthereumWallet(trimmedPhrase, 0)
        if (!testWallet) {
            return { success: false, error: 'Failed to create wallet from seed phrase' }
        }

        return { success: true, seedPhrase: trimmedPhrase }
    } catch (error) {
        console.error('Error importing seed phrase:', error)
        return { success: false, error: 'Invalid seed phrase' }
    }
}

// Local storage utilities
export const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    } catch (error) {
        console.error('Error saving to localStorage:', error)
    }
}

export const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key)
        if (!item) return defaultValue

        // Try to parse as JSON, if it fails return as string
        try {
            return JSON.parse(item)
        } catch {
            return item
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error)
        return defaultValue
    }
}

export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.error('Error removing from localStorage:', error)
    }
}

// Constants
export const STORAGE_KEYS = {
    ETHEREUM_SEED_PHRASE: 'ethereum_seed_phrase',
    ETHEREUM_WALLETS: 'ethereum_wallets'
}