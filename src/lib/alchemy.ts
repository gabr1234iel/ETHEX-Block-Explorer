import { Alchemy, Network } from 'alchemy-sdk';

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

export const resolveENS = async (ensName: string) => {
  try {
    const address = await alchemy.core.resolveName(ensName);
    return address;
  } catch (error) {
    console.error('Error resolving ENS name:', error);
    return null;
  }
};

export const isTokenAddress = async (address: string) => {
  try {
    const metadata = await alchemy.core.getTokenMetadata(address);
    return metadata && metadata.symbol && metadata.decimals;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return false;
  }
};
