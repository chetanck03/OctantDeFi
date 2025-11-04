import React from 'react'
import { RefreshCw, Download, Trash2 } from 'lucide-react'

const ActionButtons = ({ 
    seedPhrase, 
    wallets, 
    onGeneratePhrase, 
    onImportPhrase, 
    onClearAll 
}) => {
    return (
        <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {/* Generate Seed Phrase Button */}
                <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 backdrop-blur-3xl">
                        <button
                            onClick={onGeneratePhrase}
                            className="w-full inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-6 py-3 text-white font-medium transition-colors hover:bg-transparent/90"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">{seedPhrase ? 'Regenerate' : 'Generate'} Seed</span>
                            <span className="sm:hidden">Generate</span>
                        </button>
                    </div>
                </span>

                {/* Import Seed Phrase Button */}
                <button
                    onClick={onImportPhrase}
                    className="inline-flex items-center justify-center border border-neutral-600 hover:border-neutral-400 text-gray-300 hover:text-white px-6 py-3 rounded-full font-medium transition-all duration-200 bg-neutral-900/50 backdrop-blur-sm cursor-pointer"
                >
                    <Download className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Import Seed</span>
                    <span className="sm:hidden">Import</span>
                </button>

                {(seedPhrase || wallets.length > 0) && (
                    <button
                        onClick={onClearAll}
                        className="inline-flex items-center justify-center border border-red-600/50 hover:border-red-500 text-red-400 hover:text-red-300 px-6 py-3 rounded-full font-medium transition-all duration-200 bg-red-900/10 hover:bg-red-900/20 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Clear All</span>
                        <span className="sm:hidden">Clear</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default ActionButtons