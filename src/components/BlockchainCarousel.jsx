import React, { useRef, useEffect, useState } from 'react';

// Logo item component with individual hover state
const LogoItem = ({ logo }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex flex-col items-center justify-center bg-neutral-800/30 rounded-xl hover:bg-neutral-700/50 transition-all duration-300 hover:scale-105 mb-12"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <img
                src={logo.url}
                alt={logo.name}
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain transition-all duration-300"
            />
            {/* Logo name tooltip on hover */}
            <div
                className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-xs px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap z-50 border border-neutral-700 shadow-lg ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
            >
                {logo.name}
                {/* Tooltip arrow */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-neutral-900 border-l border-t border-neutral-700 rotate-45"></div>
            </div>
        </div>
    );
};


// Import local logo assets - Only supported networks
import polygonLogo from '../assests/polygon-matic-logo.svg';
import baseLogo from '../assests/base-logo.svg';
import sepoliaLogo from '../assests/sepolia-logo.svg';
import bnbLogo from '../assests/bnb-logo.svg';
import zetachainLogo from '../assests/zetachain-logo.svg';
import somniaLogo from '../assests/somnia.svg';
import citreaLogo from '../assests/citrea-logo.svg';
import liskLogo from '../assests/lisk-logo.svg';

const BlockchainCarousel = () => {
    const scrollContainerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-scroll effect with smooth animation
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollSpeed = 0.5; // pixels per frame (slower for smoother movement)
        let animationId;

        const autoScroll = () => {
            if (!isHovered && container) {
                container.scrollLeft += scrollSpeed;

                // Reset scroll position when we've scrolled through one set of logos
                const maxScroll = container.scrollWidth / 3; // Since we have 3 copies
                if (container.scrollLeft >= maxScroll) {
                    container.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        };

        animationId = requestAnimationFrame(autoScroll);
        return () => cancelAnimationFrame(animationId);
    }, [isHovered]);



    // Supported blockchain logos - 8 networks we currently use
    const blockchainLogos = [
        { name: "Polygon", url: polygonLogo },
        { name: "Base", url: baseLogo },
        { name: "Ethereum", url: sepoliaLogo },
        { name: "BNB Smart Chain", url: bnbLogo },
        { name: "ZetaChain", url: zetachainLogo },
        { name: "Somnia", url: somniaLogo },
        { name: "Citrea", url: citreaLogo },
        { name: "Lisk", url: liskLogo }
    ];

    // Triple the logos for seamless infinite scroll (more copies = smoother loop)
    const duplicatedLogos = [...blockchainLogos, ...blockchainLogos, ...blockchainLogos];

    return (
        <section className="relative py-16 bg-neutral-950 border-t border-neutral-800 overflow-hidden">
            <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

            <div className="relative z-10 container mx-auto px-4">
                <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-2xl md:text-3xl lg:text-4xl tracking-tighter text-transparent leading-tight text-center mb-12">
                    Supporting{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        EVM Compatible Networks
                    </span>
                </h2>

                {/* Infinite scroll container */}
                <div
                    className="relative carousel-container pb-12"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >

                    {/* Scrollable container with proper padding and overflow handling */}
                    <div
                        ref={scrollContainerRef}
                        className="flex space-x-8 md:space-x-12 overflow-x-auto scrollbar-hide px-4 py-2"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <LogoItem key={`${logo.name}-${index}`} logo={logo} />
                        ))}
                    </div>

                    {/* Gradient fade effects on sides */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none z-20"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none z-20"></div>
                </div>
            </div>
        </section>
    );
};

export default BlockchainCarousel;