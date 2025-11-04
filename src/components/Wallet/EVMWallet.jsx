import React, { useState, useEffect } from 'react'
import { generateMnemonic } from "bip39"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getBlockchainConfig } from '../../lib/networks'

// Import components (we'll reuse Ethereum components as they work for all EVM chains)
import EthereumHeader from './EthComponents/EthereumHeader'
import ActionButtons from './EthComponents/ActionButtons'
import SeedPhraseDisplay from './EthComponents/SeedPhraseDisplay'
import WalletGrid from './EthComponents/WalletGrid'
import ImportModal from './EthComponents/ImportModal'
import ConfirmationModals from './EthComponents/ConfirmationModals'

// Import utilities
import {
    createEVMWallet,
    validateAndImportEVMSeedPhrase
} from '../../lib/evmWalletUtils'

import {
    saveSharedEVMSeedPhrase,
    loadSharedEVMSeedPhrase,
    removeSharedEVMSeedPhrase,
    saveEVMWallets,
    loadEVMWallets,
    removeEVMWallets,
    clearAllEVMData,
    hasAnyEVMWallets
} from '../../lib/sharedEVMStorage'

function EVMWallet({ blockchain }) {
    const navigate = useNavigate()
    const blockchainConfig = getBlockchainConfig(blockchain)

    const [seedPhrase, setSeedPhrase] = useState('')
    const [wallets, setWallets] = useState([])
    const [showPrivateKeys, setShowPrivateKeys] = useState({})
    const [showSeedPhrase, setShowSeedPhrase] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)
    const [importSeedInput, setImportSeedInput] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [walletsPerPage] = useState(6)
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false)

    // Confirmation modal states
    const [showClearAllModal, setShowClearAllModal] = useState(false)
    const [showDeleteWalletModal, setShowDeleteWalletModal] = useState(false)
    const [walletToDelete, setWalletToDelete] = useState(null)
    const [showGeneratePhraseModal, setShowGeneratePhraseModal] = useState(false)

    // Load data from localStorage on component mount
    useEffect(() => {
        // Load shared seed phrase (same for all EVM chains)
        const savedSeedPhrase = loadSharedEVMSeedPhrase()

        // Load wallets specific to this blockchain
        const savedWallets = loadEVMWallets(blockchain)

        if (savedSeedPhrase) {
            setSeedPhrase(savedSeedPhrase)
        }

        if (savedWallets && Array.isArray(savedWallets)) {
            setWallets(savedWallets)
        }

        // Mark initial load as complete
        setIsInitialLoadComplete(true)
    }, [blockchain])

    // Save to localStorage whenever seedPhrase or wallets change
    useEffect(() => {
        if (seedPhrase) {
            // Save shared seed phrase for all EVM chains
            saveSharedEVMSeedPhrase(seedPhrase)
        }
    }, [seedPhrase])

    useEffect(() => {
        // Only save to localStorage after initial load is complete
        if (isInitialLoadComplete) {
            if (wallets.length > 0) {
                // Save wallets specific to this blockchain
                saveEVMWallets(blockchain, wallets)
            } else {
                // Only remove from localStorage if we explicitly cleared wallets
                removeEVMWallets(blockchain)
            }
        }
    }, [wallets, isInitialLoadComplete, blockchain])

    // Handler functions
    const handleGeneratePhrase = () => {
        // Check if any EVM chain has wallets (not just current blockchain)
        if (seedPhrase && hasAnyEVMWallets()) {
            setShowGeneratePhraseModal(true)
        } else {
            generateNewSeedPhrase()
        }
    }

    const generateNewSeedPhrase = () => {
        const newSeedPhrase = generateMnemonic()
        setSeedPhrase(newSeedPhrase)
        setWallets([])
        setCurrentPage(1)

        // Clear all EVM data (affects all EVM chains)
        clearAllEVMData()

        setShowGeneratePhraseModal(false)
        toast.success('New shared seed phrase generated for all EVM chains!')
    }

    const handleImportPhrase = () => {
        setShowImportModal(true)
    }

    const handleImportSubmit = () => {
        const result = validateAndImportEVMSeedPhrase(importSeedInput, blockchain)
        if (result.success) {
            setSeedPhrase(result.seedPhrase)
            setWallets([])
            setShowPrivateKeys({})
            setCurrentPage(1)

            // Clear all EVM data and import new seed phrase
            clearAllEVMData()

            setShowImportModal(false)
            setImportSeedInput('')
            toast.success('Shared seed phrase imported for all EVM chains!')
        } else {
            toast.error(result.error)
        }
    }

    const handleImportCancel = () => {
        setShowImportModal(false)
        setImportSeedInput('')
    }

    const handleClearAll = () => {
        setShowClearAllModal(true)
    }

    const clearAllData = () => {
        setSeedPhrase('')
        setWallets([])
        setShowPrivateKeys({})
        setShowSeedPhrase(false)
        setCurrentPage(1)

        // Clear all EVM data (affects all EVM chains)
        clearAllEVMData()

        setShowClearAllModal(false)
        toast.success('All EVM wallet data cleared (affects all EVM chains)!')
    }

    const createWallet = () => {
        if (!seedPhrase) {
            toast.error('Please generate a seed phrase first!')
            return
        }

        const walletData = createEVMWallet(blockchain, seedPhrase, wallets.length)
        if (walletData) {
            const newWallet = {
                ...walletData,
                index: wallets.length,
                id: Date.now() + Math.random()
            }
            
           
            setWallets(prev => {
                const updatedWallets = [...prev, newWallet]
                console.log('- Updated wallets array:', updatedWallets)
                return updatedWallets
            })
            toast.success(`Wallet #${wallets.length + 1} created successfully!`)
        } else {
            toast.error('Failed to create wallet. Please try again.')
        }
    }

    const handleDeleteWallet = (wallet) => {
        setWalletToDelete(wallet)
        setShowDeleteWalletModal(true)
    }

    const removeWallet = (walletToRemove) => {
        const walletId = walletToRemove.id
        setWallets(prev => prev.filter(wallet => wallet.id !== walletId))
        setShowPrivateKeys(prev => {
            const updated = { ...prev }
            delete updated[walletId]
            return updated
        })

        const newWalletCount = wallets.length - 1
        const newTotalPages = Math.ceil(newWalletCount / walletsPerPage)
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
        }

        setShowDeleteWalletModal(false)
        setWalletToDelete(null)
        toast.success(`Wallet #${walletToRemove.index + 1} removed successfully!`)
    }

    const togglePrivateKey = (walletId) => {
        setShowPrivateKeys(prev => ({
            ...prev,
            [walletId]: !prev[walletId]
        }))
    }

    const toggleSeedPhrase = () => {
        setShowSeedPhrase(prev => !prev)
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard!')
    }

    const handleSendTransaction = (publicKey) => {
        navigate(`/transaction/evm/${publicKey}`)
    }

    const handleOpenExplorer = (publicKey) => {
        const networkConfig = blockchainConfig?.networks?.mainnet
        if (networkConfig?.explorerUrl) {
            window.open(`${networkConfig.explorerUrl}/address/${publicKey}`, '_blank')
        } else {
            // Fallback to Etherscan for EVM chains
            window.open(`https://etherscan.io/address/${publicKey}`, '_blank')
        }
    }

    const handleBackToSelection = () => {
        // Clear the EVM selection but preserve the selected network
        localStorage.removeItem('selected_blockchain')
        const event = new CustomEvent('blockchainChanged', { detail: null })
        window.dispatchEvent(event)
    }

    // Pagination logic
    const indexOfLastWallet = currentPage * walletsPerPage
    const indexOfFirstWallet = indexOfLastWallet - walletsPerPage
    const currentWallets = wallets.slice(indexOfFirstWallet, indexOfLastWallet)
    const totalPages = Math.ceil(wallets.length / walletsPerPage)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

    if (!blockchainConfig) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Unsupported Blockchain</h2>
                    <p className="text-gray-400">The blockchain "{blockchain}" is not supported.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black overflow-x-auto pt-20 relative">
            {/* Background Effects */}
            <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl min-w-0">
                <EthereumHeader
                    onBackToSelection={handleBackToSelection}
                    blockchainName={blockchainConfig.name}
                    blockchainId={blockchain}
                />

                <ActionButtons
                    seedPhrase={seedPhrase}
                    wallets={wallets}
                    onGeneratePhrase={handleGeneratePhrase}
                    onImportPhrase={handleImportPhrase}
                    onClearAll={handleClearAll}
                />

                <SeedPhraseDisplay
                    seedPhrase={seedPhrase}
                    showSeedPhrase={showSeedPhrase}
                    onToggleSeedPhrase={toggleSeedPhrase}
                    onCopyToClipboard={copyToClipboard}
                />

                {seedPhrase && (
                    <WalletGrid
                        wallets={wallets}
                        currentWallets={currentWallets}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        walletsPerPage={walletsPerPage}
                        showPrivateKeys={showPrivateKeys}
                        onCreateWallet={createWallet}
                        onTogglePrivateKey={togglePrivateKey}
                        onCopyToClipboard={copyToClipboard}
                        onSendTransaction={handleSendTransaction}
                        onDeleteWallet={handleDeleteWallet}
                        onOpenExplorer={handleOpenExplorer}
                        onPrevPage={prevPage}
                        onNextPage={nextPage}
                        onPageClick={paginate}
                        blockchainSymbol={blockchainConfig.symbol}
                    />
                )}

                <ImportModal
                    isOpen={showImportModal}
                    importSeedInput={importSeedInput}
                    onInputChange={setImportSeedInput}
                    onSubmit={handleImportSubmit}
                    onCancel={handleImportCancel}
                />

                <ConfirmationModals
                    showClearAllModal={showClearAllModal}
                    showDeleteWalletModal={showDeleteWalletModal}
                    showGeneratePhraseModal={showGeneratePhraseModal}
                    walletToDelete={walletToDelete}
                    onClearAll={clearAllData}
                    onDeleteWallet={removeWallet}
                    onGeneratePhrase={generateNewSeedPhrase}
                    onCloseClearAll={() => setShowClearAllModal(false)}
                    onCloseDeleteWallet={() => {
                        setShowDeleteWalletModal(false)
                        setWalletToDelete(null)
                    }}
                    onCloseGeneratePhrase={() => setShowGeneratePhraseModal(false)}
                />
            </div>
        </div>
    )
}

export default EVMWallet