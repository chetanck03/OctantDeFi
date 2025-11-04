import React, { useEffect, useRef, useState } from 'react'
import { X, Camera, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import QrScanner from 'qr-scanner'

const QRScannerModal = ({ isOpen, onClose, onScanResult }) => {
    const videoRef = useRef(null)
    const qrScannerRef = useRef(null)
    const fileInputRef = useRef(null)
    const [scanning, setScanning] = useState(false)
    const [error, setError] = useState('')

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow
            const originalPaddingRight = document.body.style.paddingRight
            
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = `${scrollbarWidth}px`
            
            return () => {
                document.body.style.overflow = originalOverflow
                document.body.style.paddingRight = originalPaddingRight
            }
        }
    }, [isOpen])

    const startScanning = async () => {
        try {
            setError('')
            setScanning(true)
            
            if (videoRef.current) {
                qrScannerRef.current = new QrScanner(
                    videoRef.current,
                    (result) => {
                        handleScanResult(result.data)
                    },
                    {
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        preferredCamera: 'environment' // Use back camera if available
                    }
                )
                
                await qrScannerRef.current.start()
            }
        } catch (err) {
            console.error('Error starting QR scanner:', err)
            setError('Failed to start camera. Please check camera permissions.')
            setScanning(false)
        }
    }

    const stopScanning = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop()
            qrScannerRef.current.destroy()
            qrScannerRef.current = null
        }
        setScanning(false)
    }

    const handleScanResult = (data) => {
        // Extract address from QR code data (might be just address or include prefix)
        let address = data.trim()
        
        // Handle ethereum: prefix
        if (address.startsWith('ethereum:')) {
            address = address.replace('ethereum:', '')
        }
        
        // Handle other common prefixes
        if (address.includes('@')) {
            address = address.split('@')[0]
        }
        
        // Validate if it looks like an Ethereum address
        if (address.match(/^0x[a-fA-F0-9]{40}$/)) {
            onScanResult(address)
            toast.success('Address scanned successfully!')
            onClose()
        } else {
            toast.error('Invalid wallet address format in QR code')
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const result = await QrScanner.scanImage(file)
            handleScanResult(result)
        } catch (err) {
            console.error('Error scanning image:', err)
            toast.error('Could not read QR code from image')
        }
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey)
            return () => {
                document.removeEventListener('keydown', handleEscapeKey)
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            startScanning()
        } else {
            stopScanning()
        }

        return () => {
            stopScanning()
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 pt-60 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 overflow-y-auto"
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
                        <Camera className="text-purple-400" size={24} />
                        <h3 className="text-xl font-semibold text-white font-geist">
                            Scan QR Code
                        </h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Scan a wallet address QR code
                    </p>
                </div>

                {/* Camera View */}
                <div className="mb-6">
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                        <video 
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            playsInline
                            muted
                        />
                        {!scanning && (
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/50">
                                <div className="text-center">
                                    <Camera className="mx-auto mb-2 text-gray-400" size={32} />
                                    <p className="text-gray-400 text-sm">
                                        {error || 'Starting camera...'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Option */}
                <div className="mb-6">
                    <p className="text-center text-gray-400 text-sm mb-3">
                        Or upload an image with QR code
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors font-medium"
                    >
                        <Upload size={16} />
                        Upload Image
                    </button>
                </div>

                {/* Instructions */}
                <div className="p-3 bg-neutral-800/30 border border-neutral-600/50 rounded-lg">
                    <p className="text-xs text-gray-400 text-center">
                        Point your camera at a QR code containing a wallet address
                    </p>
                </div>
            </div>
        </div>
    )
}

export default QRScannerModal