"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

interface Holding {
    tokenAddress: string;
    name: string;
    ticker: string;
    balance: string;
  }
  


const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

const AccountPage = () => {
    const { hash: accountAddress } = useParams<{ hash: string }>();
    const [walletBalance, setWalletBalance] = useState<string>('0');
    const [walletHoldings, setWalletHoldings] = useState<Holding[]>([]);
    const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!accountAddress) return;

    // Fetch wallet balance
    const fetchWalletBalance = async () => {
      try {
        const balance = await alchemy.core.getBalance(accountAddress);
        console.log('balance:', balance);
        setWalletBalance(ethers.formatEther(balance.toString())); // Convert to Ether
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        setError(error as Error);
      }
    };

    // Fetch wallet holdings
    const fetchWalletHoldings = async () => {
        try {
          const tokenBalances = await alchemy.core.getTokenBalances(accountAddress);
          const holdings = await Promise.all(
            tokenBalances.tokenBalances.map(async ({ contractAddress, tokenBalance }) => {
              const metadata = await alchemy.core.getTokenMetadata(contractAddress);
              if (tokenBalance !== null) { // Null check
                return {
                  tokenAddress: contractAddress,
                  name: metadata.name,
                  ticker: metadata.symbol,
                  balance: ethers.formatUnits(tokenBalance.toString(), metadata.decimals!) // Perform null check before toString()
                };
              }
              return null;
            })
          );
          setWalletHoldings(holdings.filter((holding): holding is Holding => holding !== null)); // Filter out null values
        } catch (error) {
          console.error('Error fetching wallet holdings:', error);
          setError(error as Error);
        }
      };

    fetchWalletBalance();
    fetchWalletHoldings();
  }, [accountAddress]);

return (
    <div>
        <div className="my-5">
            <h1> showing results for account: {accountAddress}</h1>
        </div>
        <div className='mb-5'>
            <h2>Wallet Balance</h2>
            <p>{walletBalance} ETH</p>
        </div>
        <div>
            <h2>Wallet Holdings</h2>
            <ul>
                {walletHoldings.map((holding, index) => (
                    <li key={index} className='w-full flex items-center'>
                        {holding.ticker && (
                        <>
                            <Link href={`/token/${holding.tokenAddress}`}>
                                <span className='font-bold text-blue-500'>{holding.ticker}</span>
                            </Link>
                            <span>: {holding.balance}</span>
                        </>
                       )
                        }
                    </li>
                ))}
            </ul>
        </div>
        {error && <div>Error: {error.message}</div>}
    </div>
);
};

export default AccountPage;
