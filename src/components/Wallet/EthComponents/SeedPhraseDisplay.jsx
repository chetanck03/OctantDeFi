import React from 'react'
import { Shield, Eye, EyeOff, Copy } from 'lucide-react'

const SeedPhraseDisplay = ({ 
    seedPhrase, 
    showSeedPhrase, 
    onToggleSeedPhrase, 
    onCopyToClipboard 
}) => {
    if (!seedPhrase) return null

    return (
        <div className="mb-8">
            <div className="relative max-w-4xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-75"></div>
                <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
                            <Shield className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="font-geist text-xl text-white font-semibold">Seed Phrase</h3>
                            <p className="text-sm text-red-400">Keep this secure and never share it!</p>
                        </div>
                        <div className="ml-auto">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-neutral-800/50 border border-neutral-600 rounded-lg p-4 overflow-hidden">
                            <div className="font-mono text-sm md:text-base text-gray-300 break-all leading-relaxed overflow-wrap-anywhere">
                                {showSeedPhrase ? seedPhrase : '•'.repeat(seedPhrase.split(' ').length * 6)}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={onToggleSeedPhrase}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium cursor-pointer"
                            >
                                {showSeedPhrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                {showSeedPhrase ? 'Hide' : 'Show'}
                            </button>

                            {showSeedPhrase && (
                                <button
                                    onClick={() => onCopyToClipboard(seedPhrase)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors text-sm font-medium cursor-pointer"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copy Seed Phrase
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeedPhraseDisplay