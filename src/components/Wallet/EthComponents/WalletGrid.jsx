import React from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import WalletCard from './WalletCard'

const WalletGrid = ({ 
    wallets,
    currentWallets,
    currentPage,
    totalPages,
    walletsPerPage,
    showPrivateKeys,
    onCreateWallet,
    onTogglePrivateKey,
    onCopyToClipboard,
    onSendTransaction,
    onDeleteWallet,
    onOpenExplorer,
    onPrevPage,
    onNextPage,
    onPageClick,
    blockchainSymbol = 'ETH'
}) => {
    const indexOfLastWallet = currentPage * walletsPerPage
    const indexOfFirstWallet = indexOfLastWallet - walletsPerPage

    return (
        <div>
            {/* Create New Wallet Button */}
            <div className="mb-8 text-center">
                <div className="relative inline-block overflow-hidden rounded-full p-[2px]">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <div className="inline-flex items-center justify-center rounded-full bg-neutral-950 backdrop-blur-3xl">
                        <button
                            onClick={onCreateWallet}
                            className="inline-flex items-center justify-center gap-3 rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-8 py-4 text-white font-medium transition-colors hover:bg-transparent/90"
                        >
                            <Plus className="h-5 w-5 flex-shrink-0" />
                            <span className="whitespace-nowrap">Add New Wallet</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Only show wallet list if there are wallets */}
            {wallets.length > 0 && (
                <>
                    {/* Wallet Count Info */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-white">Generated Wallets</h3>
                        <div className="text-sm text-gray-400">
                            Showing {indexOfFirstWallet + 1}-{Math.min(indexOfLastWallet, wallets.length)} of {wallets.length} wallets
                        </div>
                    </div>

                    {/* Responsive Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {currentWallets.map((wallet) => (
                            <WalletCard
                                key={wallet.id}
                                wallet={wallet}
                                showPrivateKey={showPrivateKeys[wallet.id]}
                                onTogglePrivateKey={onTogglePrivateKey}
                                onCopyToClipboard={onCopyToClipboard}
                                onSendTransaction={onSendTransaction}
                                onDeleteWallet={onDeleteWallet}
                                onOpenExplorer={onOpenExplorer}
                                blockchainSymbol={blockchainSymbol}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                    {/* Page Info */}
                    <div className="text-sm text-gray-400 order-2 sm:order-1">
                        Page {currentPage} of {totalPages}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        {/* Previous Button */}
                        <button
                            onClick={onPrevPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 hover:bg-neutral-700/50 disabled:bg-neutral-800/20 text-gray-300 hover:text-white disabled:text-gray-500 border border-neutral-600 hover:border-neutral-500 disabled:border-neutral-700 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed font-medium"
                        >
                            <ChevronLeft size={16} />
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                                // Show first page, last page, current page, and pages around current
                                const showPage = pageNumber === 1 || 
                                               pageNumber === totalPages || 
                                               Math.abs(pageNumber - currentPage) <= 1

                                if (!showPage && pageNumber === 2 && currentPage > 4) {
                                    return <span key={pageNumber} className="text-gray-500 px-2">...</span>
                                }
                                if (!showPage && pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                                    return <span key={pageNumber} className="text-gray-500 px-2">...</span>
                                }
                                if (!showPage) return null

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => onPageClick(pageNumber)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                                            currentPage === pageNumber
                                                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                                                : 'bg-neutral-800/50 hover:bg-neutral-700/50 text-gray-300 hover:text-white border border-neutral-600 hover:border-neutral-500'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={onNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 hover:bg-neutral-700/50 disabled:bg-neutral-800/20 text-gray-300 hover:text-white disabled:text-gray-500 border border-neutral-600 hover:border-neutral-500 disabled:border-neutral-700 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed font-medium"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WalletGrid