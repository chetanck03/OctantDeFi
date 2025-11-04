import React, { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react'

const ConfirmationModals = ({
    showClearAllModal,
    showDeleteWalletModal,
    showGeneratePhraseModal,
    walletToDelete,
    onClearAll,
    onDeleteWallet,
    onGeneratePhrase,
    onCloseClearAll,
    onCloseDeleteWallet,
    onCloseGeneratePhrase
}) => {
    // Prevent background scrolling when any modal is open
    useEffect(() => {
        const isAnyModalOpen = showClearAllModal || showDeleteWalletModal || showGeneratePhraseModal

        if (isAnyModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [showClearAllModal, showDeleteWalletModal, showGeneratePhraseModal])

    return (
        <>
            {/* Clear All Confirmation Modal */}
            {showClearAllModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl border border-red-500/30 p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 shadow-2xl">
                        {/* Animated border effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl blur opacity-75"></div>

                        <div className="relative">
                            {/* Warning Icon */}
                            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
                                <Trash2 className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
                            </div>

                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-white text-center font-geist">
                                Clear All Data?
                            </h3>

                            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 text-center leading-relaxed px-2">
                                This will permanently delete your <strong className="text-white">shared EVM seed phrase</strong> and all generated wallets across <strong className="text-white">all EVM chains</strong>.
                                <span className="block mt-2 text-red-400 font-medium text-sm sm:text-base">
                                    This action cannot be undone!
                                </span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Cancel Button */}
                                <button
                                    onClick={onCloseClearAll}
                                    className="flex-1 hover:to-slate-500/90 text-gray-300 hover:text-white py-2.5 sm:py-3 px-3 rounded-xl font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/70 text-sm sm:text-base"
                                >
                                    Cancel
                                </button>

                                {/* Delete Button with Spinning Border */}
                                <span className="relative inline-block overflow-hidden rounded-xl p-[1.5px] flex-1">
                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ef4444_0%,#dc2626_50%,#ef4444_100%)]" />
                                    <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-950 backdrop-blur-3xl">
                                        <button
                                            onClick={onClearAll}
                                            className="w-full inline-flex items-center justify-center rounded-xl border-[1px] border-transparent bg-gradient-to-tr from-red-500/20 via-red-400/30 to-transparent py-2.5 sm:py-3 px-3 sm:px-4 text-white font-medium transition-colors hover:bg-transparent/90 text-sm sm:text-base"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Wallet Confirmation Modal */}
            {showDeleteWalletModal && walletToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl border border-red-500/30 p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 shadow-2xl">
                        {/* Animated border effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl blur opacity-75"></div>

                        <div className="relative">
                            {/* Warning Icon */}
                            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
                                <Trash2 className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
                            </div>

                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-white text-center font-geist">
                                Delete Wallet #{walletToDelete.index + 1}?
                            </h3>

                            <div className="mb-4 sm:mb-6">
                                <p className="text-sm sm:text-base text-gray-300 text-center leading-relaxed mb-3 sm:mb-4 px-2">
                                    Are you sure you want to delete this wallet?
                                </p>

                                {/* Wallet Info Display */}
                                <div className="bg-neutral-800/50 border border-neutral-600/50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                                    <div className="text-xs sm:text-sm text-gray-400 mb-2">Wallet Address:</div>
                                    <div className="font-mono text-xs text-gray-300 break-all bg-neutral-900/50 p-2 rounded border leading-relaxed">
                                        {walletToDelete.publicKey}
                                    </div>
                                </div>

                                <p className="text-red-400 font-medium text-center text-sm sm:text-base">
                                    This action cannot be undone!
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Cancel Button */}
                                <button
                                    onClick={onCloseDeleteWallet}
                                    className="flex-1 text-gray-300 hover:text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/70 text-sm sm:text-base"
                                >
                                    Cancel
                                </button>

                                {/* Delete Button with Spinning Border */}
                                <span className="relative inline-block overflow-hidden rounded-xl p-[1.5px] flex-1">
                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ef4444_0%,#dc2626_50%,#ef4444_100%)]" />
                                    <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-950 backdrop-blur-3xl">
                                        <button
                                            onClick={() => onDeleteWallet(walletToDelete)}
                                            className="w-full inline-flex items-center justify-center rounded-xl border-[1px] border-transparent bg-gradient-to-tr from-red-500/20 via-red-400/30 to-transparent py-2.5 sm:py-3 px-3 sm:px-4 text-white font-medium transition-colors hover:bg-transparent/90 text-sm sm:text-base"
                                        >
                                            Yes, Delete
                                        </button>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Generate New Phrase Confirmation Modal */}
            {showGeneratePhraseModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl border border-yellow-500/30 p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 shadow-2xl">
                        {/* Animated border effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl blur opacity-75"></div>

                        <div className="relative">
                            {/* Warning Icon */}
                            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                                <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
                            </div>

                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-white text-center font-geist">
                                Generate New Seed Phrase?
                            </h3>

                            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 text-center leading-relaxed px-2">
                                Generating a new seed phrase will clear all existing wallets across <strong className="text-white">all EVM chains</strong> (Ethereum, Base, Polygon, Avalanche, BNB Smart Chain).
                                <span className="block mt-2 text-yellow-400 font-medium text-sm sm:text-base">
                                    Make sure you have backed up your current shared seed phrase and private keys.
                                </span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Cancel Button */}
                                <button
                                    onClick={onCloseGeneratePhrase}
                                    className="flex-1 text-gray-300 hover:text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/70 text-sm sm:text-base"
                                >
                                    Cancel
                                </button>

                                {/* Generate Button with Spinning Border */}
                                <span className="relative inline-block overflow-hidden rounded-xl p-[1.5px] flex-1">
                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#eab308_0%,#f59e0b_50%,#eab308_100%)]" />
                                    <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-950 backdrop-blur-3xl">
                                        <button
                                            onClick={onGeneratePhrase}
                                            className="w-full inline-flex items-center justify-center rounded-xl border-[1px] border-transparent bg-gradient-to-tr from-yellow-500/20 via-yellow-400/30 to-transparent py-2.5 sm:py-3 px-3 sm:px-4 text-white font-medium transition-colors hover:bg-transparent/90 text-sm sm:text-base"
                                        >
                                            Generate New
                                        </button>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ConfirmationModals