import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { WarningGraphic } from './ui/warning-graphic';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
      {/* Background with same styling as landing page */}
      <div className="relative w-full bg-neutral-950 min-h-screen">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <section className="relative z-1 mx-auto max-w-full">
          <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-30 sm:opacity-50 [perspective:200px]">
            <div className="absolute inset-0 [transform:rotateX(35deg)]">
              <div className="animate-grid [inset:0%_0px] [margin-left:-50%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_0)] sm:[background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:80px_80px] sm:[background-size:120px_120px] [background-repeat:repeat]"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent to-90%"></div>
          </div>

          <div className="z-10 mx-auto max-w-screen-xl gap-12 px-4 py-16 sm:py-20 md:py-28 text-gray-600 md:px-8 flex items-center justify-center min-h-screen">
            <div className="max-w-2xl mx-auto text-center">
              {/* Animated Warning Graphic */}
              <div className="mb-8 flex justify-center">
                <WarningGraphic 
                  width={400}
                  height={160}
                  enableAnimations={true}
                  animationSpeed={1.2}
                  color="#FDC221"
                  className="drop-shadow-lg"
                />
              </div>

              {/* Error Content */}
              <div className="space-y-6">
                <div>
                  <h1 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-6xl md:text-8xl font-bold text-transparent mb-4">
                    404
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
                    Page Not Found
                  </h2>
                  <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed px-4">
                    Oops! The page you're looking for seems to have wandered off into the blockchain. 
                    Let's get you back to safety.
                  </p>
                </div>

                {/* Action Buttons - Same styling as landing page */}
                <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-4 pt-8">
                  {/* Primary Button with Spinning Border - Same as landing page */}
                  <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] order-2 sm:order-1 mb-4 sm:mb-0">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
                      <Link
                        to="/"
                        className="group inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-8 sm:px-10 py-3 sm:py-4 text-center text-white transition-colors hover:bg-transparent/90 text-sm sm:text-base font-medium min-w-[160px] sm:min-w-[180px]"
                      >
                        <Home className="mr-2 h-4 w-4" />
                        Go Home
                      </Link>
                    </div>
                  </span>

                  {/* Secondary Button - Same styling as landing page */}
                  <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] order-1 sm:order-2 mb-4 sm:mb-0">
                    <button
                      onClick={() => window.history.back()}
                      className="inline-flex items-center justify-center border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium transition-all duration-200 text-sm sm:text-base min-w-[160px] sm:min-w-[180px] bg-gray-950"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      <span>Go Back</span>
                    </button>
                  </span>
                </div>

                {/* Additional Help */}
                {/* <div className="pt-8 border-t border-gray-700 mt-12">
                  <p className="text-sm text-gray-500 mb-4">
                    Need help? Here are some popular pages:
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      to="/dashboard"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm underline"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/about"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm underline"
                    >
                      About
                    </Link>
                    <Link
                      to="/contact"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm underline"
                    >
                      Contact
                    </Link>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NotFound;