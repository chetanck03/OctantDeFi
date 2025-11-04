// Shared storage manager for all EVM-compatible chains
// This allows Ethereum, Base, Polygon, Avalanche, and BNB Smart Chain to share the same seed phrase

import { getEVMCompatibleBlockchains } from './networks'

// Shared storage keys for EVM chains
export const SHARED_EVM_STORAGE_KEYS = {
    SEED_PHRASE: 'evm_shared_seed_phrase',
    WALLETS: 'evm_shared_wallets'
}

// Save shared seed phrase for all EVM chains
export const saveSharedEVMSeedPhrase = (seedPhrase) => {
    try {
        localStorage.setItem(SHARED_EVM_STORAGE_KEYS.SEED_PHRASE, seedPhrase)
    } catch (error) {
        console.error('Error saving shared EVM seed phrase:', error)
    }
}

// Load shared seed phrase for all EVM chains
export const loadSharedEVMSeedPhrase = () => {
    try {
        return localStorage.getItem(SHARED_EVM_STORAGE_KEYS.SEED_PHRASE)
    } catch (error) {
        console.error('Error loading shared EVM seed phrase:', error)
        return null
    }
}

// Remove shared seed phrase
export const removeSharedEVMSeedPhrase = () => {
    try {
        localStorage.removeItem(SHARED_EVM_STORAGE_KEYS.SEED_PHRASE)
    } catch (error) {
        console.error('Error removing shared EVM seed phrase:', error)
    }
}

// Save wallets for EVM (unified storage - shared across all EVM chains)
export const saveEVMWallets = (blockchain, wallets) => {
    try {
        // Use unified storage key for all EVM chains since wallets are shared
        localStorage.setItem(SHARED_EVM_STORAGE_KEYS.WALLETS, JSON.stringify(wallets))
    } catch (error) {
        console.error('Error saving EVM wallets:', error)
    }
}

// Load wallets for EVM chains (shared storage)
export const loadEVMWallets = (blockchain) => {
    try {
        // First try to load from unified storage
        let data = localStorage.getItem(SHARED_EVM_STORAGE_KEYS.WALLETS)
        
        // If no data in unified storage, try legacy blockchain-specific storage for backward compatibility
        if (!data) {
            const legacyKey = `${blockchain}_wallets`
            data = localStorage.getItem(legacyKey)
            
            // If found in legacy storage, migrate to unified storage
            if (data) {
                const wallets = JSON.parse(data)
                saveEVMWallets(blockchain, wallets)
                localStorage.removeItem(legacyKey) // Clean up legacy storage
                return wallets
            }
        }
        
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error(`Error loading EVM wallets:`, error)
        return []
    }
}

// Remove wallets for EVM chains
export const removeEVMWallets = (blockchain) => {
    try {
        // Remove from unified storage
        localStorage.removeItem(SHARED_EVM_STORAGE_KEYS.WALLETS)
        
        // Also clean up any legacy blockchain-specific storage
        const legacyKey = `${blockchain}_wallets`
        localStorage.removeItem(legacyKey)
    } catch (error) {
        console.error(`Error removing EVM wallets:`, error)
    }
}

// Clear all EVM data (seed phrase and all wallets)
export const clearAllEVMData = () => {
    try {
        // Remove shared seed phrase
        removeSharedEVMSeedPhrase()
        
        // Remove shared wallets
        localStorage.removeItem(SHARED_EVM_STORAGE_KEYS.WALLETS)
        
        // Also clean up any legacy blockchain-specific storage
        const evmChains = getEVMCompatibleBlockchains()
        evmChains.forEach(blockchain => {
            const legacyKey = `${blockchain}_wallets`
            localStorage.removeItem(legacyKey)
        })
        
        // Clean up legacy 'evm_wallets' key if it exists
        localStorage.removeItem('evm_wallets')
    } catch (error) {
        console.error('Error clearing all EVM data:', error)
    }
}

// Check if any EVM chain has wallets
export const hasAnyEVMWallets = () => {
    try {
        // Since we use unified storage, just check the shared wallets
        const data = localStorage.getItem(SHARED_EVM_STORAGE_KEYS.WALLETS)
        const wallets = data ? JSON.parse(data) : []
        return wallets.length > 0
    } catch (error) {
        console.error('Error checking EVM wallets:', error)
        return false
    }
}

// Get wallet count across all EVM chains
export const getTotalEVMWalletCount = () => {
    try {
        // Since we use unified storage, just count the shared wallets
        const data = localStorage.getItem(SHARED_EVM_STORAGE_KEYS.WALLETS)
        const wallets = data ? JSON.parse(data) : []
        return wallets.length
    } catch (error) {
        console.error('Error getting total EVM wallet count:', error)
        return 0
    }
}