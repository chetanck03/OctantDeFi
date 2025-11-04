import React from "react";
import { ContainerScroll } from "./container-scroll-animation";

export function WalletScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-2xl md:text-4xl font-semibold text-white mb-4">
              Experience the power of{' '}
              <br />
              <span className="text-3xl md:text-[4rem] font-bold mt-1 leading-none bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                WalletX Dashboard
              </span>
            </h1>
          </>
        }
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="mx-auto rounded-2xl object-cover h-full w-full"
          style={{
            objectFit: 'cover'
          }}
        >
          <source src="/wallet.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </ContainerScroll>
    </div>
  );
}