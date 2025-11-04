import React, { useState, useEffect, useRef } from 'react'
import { X, Download, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'

const QRCodeModal = ({ isOpen, onClose, walletAddress, walletName }) => {
    const [qrDataUrl, setQrDataUrl] = useState('')
    const canvasRef = useRef(null)

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            // Store original body overflow
            const originalOverflow = document.body.style.overflow
            const originalPaddingRight = document.body.style.paddingRight
            
            // Calculate scrollbar width
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            
            // Prevent scrolling and compensate for scrollbar
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = `${scrollbarWidth}px`
            
            // Cleanup function
            return () => {
                document.body.style.overflow = originalOverflow
                document.body.style.paddingRight = originalPaddingRight
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen && walletAddress) {
            generateQRCode()
        }
    }, [isOpen, walletAddress])

    const generateQRCode = async () => {
        try {
            // Generate QR code with custom options for better visibility
            const dataUrl = await QRCode.toDataURL(walletAddress, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'M'
            })
            setQrDataUrl(dataUrl)
        } catch (error) {
            console.error('Error generating QR code:', error)
        }
    }

    const downloadQRCode = () => {
        if (!qrDataUrl) return

        const link = document.createElement('a')
        link.download = `${walletName || 'wallet'}_address_qr.png`
        link.href = qrDataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Show success toast
        toast.success('QR code downloaded successfully!')
    }

    const copyAddress = () => {
        navigator.clipboard.writeText(walletAddress)
        toast.success('Address copied to clipboard!')
    }

    const handleBackdropClick = (e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }

    // Handle escape key
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey)
            return () => {
                document.removeEventListener('keydown', handleEscapeKey)
            }
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 bg-black/70 pt-50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 overflow-y-auto"
            onClick={handleBackdropClick}
            style={{ margin: 0 }}
        >
            <div 
                className="bg-neutral-900/95 border border-neutral-700 rounded-xl w-full max-w-md mx-auto my-4 p-6 relative shadow-2xl transform transition-all duration-200 scale-100 min-h-fit max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 hover:bg-neutral-800 rounded-lg"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <QrCode className="text-purple-400" size={24} />
                        <h3 className="text-xl font-semibold text-white font-geist">
                            WalletX QR Code
                        </h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                        {walletName || 'Wallet Address'}
                    </p>
                </div>

                {/* QR Code Display */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white p-3 rounded-lg">
                        {qrDataUrl ? (
                            <img
                                src={qrDataUrl}
                                alt="Wallet Address QR Code"
                                className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
                            />
                        ) : (
                            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center bg-gray-100">
                                <div className="text-gray-500 text-sm">Generating QR Code...</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Wallet Address */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Wallet Address:
                    </label>
                    <div className="bg-neutral-800/50 border border-neutral-600 rounded-lg p-3">
                        <code className="text-xs text-gray-300 font-mono break-all leading-relaxed">
                            {walletAddress}
                        </code>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col justify-center sm:flex-row gap-3">
                    <button
                        onClick={copyAddress}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        <QrCode size={16} />
                        <span className="text-sm">Copy Address</span>
                    </button>
                    
                    <button
                        onClick={downloadQRCode}
                        disabled={!qrDataUrl}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        <Download size={16} />
                        <span className="text-sm">Download QR</span>
                    </button>
                </div>

                {/* Instructions */}
                <div className="mt-4 p-3 bg-neutral-800/30 border border-neutral-600/50 rounded-lg">
                    <p className="text-xs text-gray-400 text-center">
                        Scan this QR code with any wallet app to send funds to this address
                    </p>
                </div>
            </div>
        </div>
    )
}

export default QRCodeModal