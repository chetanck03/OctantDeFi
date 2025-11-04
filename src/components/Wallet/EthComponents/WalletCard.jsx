import React from 'react'
import { Send, Trash2, Copy, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { getBlockchainConfig } from '../../../lib/networks'

const WalletCard = ({ 
    wallet, 
    showPrivateKey, 
    onTogglePrivateKey, 
    onCopyToClipboard, 
    onSendTransaction, 
    onDeleteWallet,
    blockchainSymbol = 'ETH',
    onOpenExplorer
}) => {
    const openExplorer = () => {
        if (onOpenExplorer) {
            onOpenExplorer(wallet.publicKey)
        } else {
            // Default Ethereum mainnet explorer
            window.open(`https://etherscan.io/address/${wallet.publicKey}`, '_blank')
        }
    }
    return (
        <div className="group relative">
            {/* Animated Border Effect - Optimized */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-200 will-change-auto" />

            {/* Main Card */}
            <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors duration-200 overflow-hidden">
                {/* Card Header */}
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-geist text-xl bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
                        EVM Wallet #{wallet.index + 1}
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 bg-neutral-800/50 px-3 py-1 rounded-full border border-neutral-600 hidden sm:block font-mono">
                            {wallet.path}
                        </span>

                        {/* Send Button with Landing Page Style */}
                        <span className="relative inline-block overflow-hidden rounded-lg p-[1px]">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#059669_50%,#10b981_100%)]" />
                            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-neutral-950 backdrop-blur-3xl">
                                <button
                                    onClick={() => onSendTransaction(wallet.publicKey)}
                                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-green-400/20 to-transparent px-3 py-2 text-white font-medium transition-colors hover:bg-transparent/90 text-sm"
                                    title="Send transaction"
                                >
                                    <Send size={14} className="mr-1" />
                                    <span className="hidden  sm:inline">Send</span>
                                </button>
                            </div>
                        </span>

                        {/* Explorer Button
                        <button
                            onClick={openExplorer}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/20 transition-colors cursor-pointer border border-blue-500/20 hover:border-blue-500/40"
                            title="View on explorer"
                        >
                            <ExternalLink size={16} />
                        </button> */}

                        <button
                            onClick={() => onDeleteWallet(wallet)}
                            className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors cursor-pointer border border-red-500/20 hover:border-red-500/40"
                            title="Remove wallet"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Public Key Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3 font-geist">
                        Public Key (Address):
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-neutral-800/50 border border-neutral-600 rounded-lg p-3 overflow-hidden">
                            <code className="text-xs sm:text-sm text-gray-300 font-mono break-all leading-relaxed">
                                {wallet.publicKey}
                            </code>
                        </div>
                        <button
                            onClick={() => onCopyToClipboard(wallet.publicKey)}
                            className="flex items-center gap-1 px-3 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors cursor-pointer flex-shrink-0 font-medium text-sm"
                        >
                            <Copy size={14} />
                            <span className="hidden sm:inline">Copy</span>
                        </button>
                    </div>
                </div>

                {/* Private Key Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3 font-geist">
                        Private Key:
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-neutral-800/50 border border-neutral-600 rounded-lg p-3 overflow-hidden">
                            <code className="text-xs sm:text-sm text-gray-300 font-mono break-all leading-relaxed">
                                {showPrivateKey ? wallet.privateKey : '•'.repeat(64)}
                            </code>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            <button
                                onClick={() => onTogglePrivateKey(wallet.id)}
                                className="flex items-center gap-1 px-3 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-gray-300 hover:text-white border border-neutral-600 hover:border-neutral-500 rounded-lg transition-colors cursor-pointer font-medium text-sm"
                            >
                                {showPrivateKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                <span className="hidden sm:inline">{showPrivateKey ? 'Hide' : 'Show'}</span>
                            </button>
                            {showPrivateKey && (
                                <button
                                    onClick={() => onCopyToClipboard(wallet.privateKey)}
                                    className="flex items-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors cursor-pointer font-medium"
                                >
                                    <Copy size={16} />
                                    <span className="hidden sm:inline">Copy</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletCard