// Multi-blockchain network configuration
export const NETWORK_CONFIGS = {
  base: {
    id: 'base',
    name: 'Base',
    symbol: 'ETH',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'Base Sepolia',
        chainId: 84532,
        rpcUrl: import.meta.env.VITE_BASE_TESTNET_RPC_URL || 'https://sepolia.base.org',
        explorerUrl: 'https://sepolia.basescan.org',
        faucetUrl: 'https://portal.cdp.coinbase.com/products/faucet'
      }
    }
  },
  citrea: {
    id: 'citrea',
    name: 'Citrea',
    symbol: 'cBTC',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'Citrea Testnet',
        chainId: 5115,
        rpcUrl: import.meta.env.VITE_CITREA_TESTNET_RPC_URL || 'https://rpc.testnet.citrea.xyz',
        explorerUrl: 'https://explorer.testnet.citrea.xyz',
        faucetUrl: 'https://citrea.xyz/faucet'
      }
    }
  },
  lisk: {
    id: 'lisk',
    name: 'Lisk',
    symbol: 'ETH',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'Lisk Testnet',
        chainId: 4202,
        rpcUrl: import.meta.env.VITE_LISK_TESTNET_RPC_URL || 'https://rpc.sepolia-api.lisk.com',
        explorerUrl: 'https://sepolia-blockscout.lisk.com',
        faucetUrl: 'https://console.optimism.io/faucet'
      },
      mainnet: {
        name: 'Lisk Mainnet',
        chainId: 1135,
        rpcUrl: import.meta.env.VITE_LISK_MAINNET_RPC_URL || 'https://rpc.api.lisk.com',
        explorerUrl: 'https://blockscout.lisk.com',
        faucetUrl: null
      }
    }
  },
  
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'Polygon Amoy',
        chainId: 80002,
        rpcUrl: import.meta.env.VITE_POLYGON_TESTNET_RPC_URL || 'https://rpc-amoy.polygon.technology',
        explorerUrl: 'https://amoy.polygonscan.com',
        faucetUrl: 'https://faucet.polygon.technology'
      }
    }
  },
  sepolia: {
    id: 'sepolia',
    name: 'Ethereum',
    symbol: 'ETH',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'Ethereum Sepolia',
        chainId: 11155111,
        rpcUrl: import.meta.env.VITE_SEPOLIA_TESTNET_RPC_URL || 'https://sepolia.gateway.tenderly.co',
        explorerUrl: 'https://sepolia.etherscan.io',
        faucetUrl: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia'
      }
    }
  },
  somnia: {
    id: 'somnia',
    name: 'Somnia',
    symbol: 'STT',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'Somnia Testnet',
        chainId: 50312,
        rpcUrl: import.meta.env.VITE_SOMNIA_TESTNET_RPC_URL || 'https://dream-rpc.somnia.network',
        explorerUrl: 'https://shannon-explorer.somnia.network',
        faucetUrl: 'https://cloud.google.com/application/web3/faucet/somnia/shannon'
      }
    }
  },
  bnb: {
    id: 'bnb',
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'BNB Testnet',
        chainId: 97,
        rpcUrl: import.meta.env.VITE_BNB_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545',
        explorerUrl: 'https://testnet.bscscan.com',
        faucetUrl: 'https://faucet.trade/bsc-testnet-bnb-faucet'
      }
    }
  },

  zetachain: {
    id: 'zetachain',
    name: 'ZetaChain',
    symbol: 'ZETA',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'ZetaChain Testnet',
        chainId: 7001,
        rpcUrl: import.meta.env.VITE_ZETACHAIN_TESTNET_RPC_URL || 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public',
        explorerUrl: 'https://zetachain-athens-3.blockscout.com',
        faucetUrl: 'https://cloud.google.com/application/web3/faucet/zetachain/testnet'
      }
    }
  },

  

}

// Helper functions
export const getNetworkConfig = (blockchain, network = 'mainnet') => {
  return NETWORK_CONFIGS[blockchain]?.networks[network]
}

export const getBlockchainConfig = (blockchain) => {
  return NETWORK_CONFIGS[blockchain]
}

export const getAllSupportedBlockchains = () => {
  return Object.keys(NETWORK_CONFIGS)
}

export const getEVMCompatibleBlockchains = () => {
  return Object.keys(NETWORK_CONFIGS).filter(blockchain =>
    NETWORK_CONFIGS[blockchain].coinType === 60
  )
}

export const isEVMCompatible = (blockchain) => {
  return NETWORK_CONFIGS[blockchain]?.coinType === 60
}