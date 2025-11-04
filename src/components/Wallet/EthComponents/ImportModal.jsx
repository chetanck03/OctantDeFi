import React, { useEffect } from 'react'
import { X, Download } from 'lucide-react'

const ImportModal = ({ 
    isOpen, 
    importSeedInput, 
    onInputChange, 
    onSubmit, 
    onCancel 
}) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 shadow-2xl">
                {/* Animated border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-green-400/20 rounded-2xl blur opacity-75"></div>

                <div className="relative">
                    {/* Header with Icon */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-green-400/20 border border-purple-500/30">
                                <Download className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-geist">Import Seed Phrase</h3>
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-neutral-800/50 rounded-lg"
                        >
                            <X size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>
                    
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3 font-geist">
                            Enter your 12 or 24 word seed phrase:
                        </label>
                        <textarea
                            value={importSeedInput}
                            onChange={(e) => onInputChange(e.target.value)}
                            placeholder="Enter your seed phrase here..."
                            className="w-full h-24 sm:h-32 bg-neutral-800/50 border border-neutral-600 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-colors"
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 text-gray-300 hover:text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/70 text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                        
                        {/* Import Button with Spinning Border */}
                        <span className="relative inline-block overflow-hidden rounded-xl p-[1.5px] flex-1">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#9945ff_0%,#14f195_50%,#9945ff_100%)]" />
                            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-950 backdrop-blur-3xl">
                                <button
                                    onClick={onSubmit}
                                    className="w-full inline-flex items-center justify-center rounded-xl border-[1px] border-transparent bg-gradient-to-tr from-purple-500/20 via-purple-400/30 to-transparent py-2.5 sm:py-3 px-3 sm:px-4 text-white font-medium transition-colors hover:bg-transparent/90 text-sm sm:text-base"
                                >
                                    Import
                                </button>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportModal