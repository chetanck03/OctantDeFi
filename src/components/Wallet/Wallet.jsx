import React, { useState, useEffect } from 'react'
import EVMWallet from './EVMWallet'
import { isEVMCompatible } from '../../lib/networks'

function Wallet({ blockchain }) {
    // Initialize with saved network or 'base' as fallback, but give priority to localStorage
    const [selectedBlockchain, setSelectedBlockchain] = useState(() => {
        const savedNetwork = localStorage.getItem('selected_network')
        return savedNetwork || blockchain || 'base'
    })

    // Update selected blockchain when prop changes or load from localStorage
    useEffect(() => {
        // Check for saved network first, then use prop, then default to base
        const savedNetwork = localStorage.getItem('selected_network')
        const targetBlockchain = savedNetwork || blockchain || 'base'
        
        setSelectedBlockchain(targetBlockchain)
        
        // Save to localStorage if it's not already saved
        if (!savedNetwork && targetBlockchain) {
            localStorage.setItem('selected_network', targetBlockchain)
        }
    }, [blockchain])

    // Listen for network changes from other components (like TransactionPage)
    useEffect(() => {
        const handleNetworkChange = (event) => {
            const newNetwork = event.detail
            if (newNetwork && newNetwork !== selectedBlockchain) {
                setSelectedBlockchain(newNetwork)
                localStorage.setItem('selected_network', newNetwork)
            }
        }

        const handleStorageChange = (event) => {
            if (event.key === 'selected_network' && event.newValue) {
                setSelectedBlockchain(event.newValue)
            }
        }

        // Listen for blockchain changes from TransactionPage
        window.addEventListener('blockchainChanged', handleNetworkChange)
        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('blockchainChanged', handleNetworkChange)
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [selectedBlockchain])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Render EVM-Compatible Blockchain Component */}
            {selectedBlockchain && isEVMCompatible(selectedBlockchain) && (
                <EVMWallet blockchain={selectedBlockchain} />
            )}
        </div>
    )
}

export default Wallet