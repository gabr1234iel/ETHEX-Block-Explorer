"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { useParams } from 'next/navigation';

interface Holding {
  address: string;
  balance: string;
}

interface TokenDetails {
  ticker: string;
  name: string;
  creator: string;
  etherscanLink: string;
  totalSupply?: string;
  totalHolders?: number;
  topHolders?: Holding[];
}

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

const TokenPage = () => {
  const { hash: tokenAddress } = useParams<{ hash: string }>();
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const tokenMetadata = await alchemy.core.getTokenMetadata(tokenAddress);
        // TODO, doesnt exist as of now
        // const tokenHolders = await alchemy.core.getTokenHolders(tokenAddress);

        // const topHolders = tokenHolders.holders.slice(0, 20).map(holder => ({
        //   address: holder.address,
        //   balance: ethers.formatUnits(holder.balance.toString(), tokenMetadata.decimals),
        // }));
        const deployer = await alchemy.core.findContractDeployer(tokenAddress);

        const tokenDetails: TokenDetails = {
          ticker: tokenMetadata.symbol!,
          name: tokenMetadata.name!,
          creator: deployer.deployerAddress!,
          etherscanLink: `https://etherscan.io/token/${tokenAddress}`,
        //   totalSupply: ethers.formatUnits(tokenMetadata.totalSupply.toString(), tokenMetadata.decimals!),
        //   totalHolders: tokenHolders.holders.length,
        //   topHolders: topHolders,
        };

        setTokenDetails(tokenDetails);
      } catch (error) {
        console.error('Error fetching token details:', error);
        setError(error as Error);
      }
    };

    if (tokenAddress) {
      fetchTokenDetails();
    }
  }, [tokenAddress]);

  if (!tokenDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='my-5 flex flex-col gap-2'>
      <h1>{tokenDetails.name} ({tokenDetails.ticker})</h1>
      <p>Token Contract Address: { tokenAddress }</p>
      <p>Created by: {tokenDetails.creator}</p>
      {/* <p>Total Supply: {tokenDetails.totalSupply}</p>
      <p>Total Holders: {tokenDetails.totalHolders}</p> */}
      <p className='underline font-bold text-blue-500'><Link href={tokenDetails.etherscanLink}>View on Etherscan</Link></p>

      {/* <h2>Top Holders:</h2>
      <ul>
        {tokenDetails.topHolders.map((holder, index) => (
          <li key={index}>
            <Link href={`/account/${holder.address}`}>
              <a>{holder.address}</a>
            </Link>
            : {holder.balance}
          </li>
        ))}
      </ul> */}

      {error && <div>Error: {error.message}</div>}
    </div>
  );
};

export default TokenPage;
