"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { resolveENS, isTokenAddress } from '@/lib/alchemy';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  const handleKeyPress = async (event: { key: string }) => {
    if (event.key === 'Enter') {
      await processSearchTerm(searchTerm);
    }
  };

  const handleSearch = async () => {
    await processSearchTerm(searchTerm);
  };

  const processSearchTerm = async (term: string) => {
    setSearching(true); // Start searching
    try {
      if (term.endsWith('.eth')) {
        const address = await resolveENS(term);
        if (address) {
          router.push(`/account/${address}`);
        } else {
          alert("ENS name could not be resolved.");
        }
      } else if (/^0x[a-fA-F0-9]{40}$/.test(term)) {
        const isToken = await isTokenAddress(term);
        if (isToken) {
          router.push(`/token/${term}`);
        } else {
          router.push(`/account/${term}`);
        }
      } else if (/^0x[a-fA-F0-9]{64}$/.test(term)) {
        router.push(`/transaction/${term}`);
      } else if (/^\d+$/.test(term)) {
        router.push(`/block/${term}`);
      } else {
        alert("Invalid search term. Please enter a valid address, ENS name, transaction hash, or block number.");
      }
    } finally {
      setSearching(false); // End searching
    }
  };

  return (
    <div className="w-full max-w-lg">
      <h1 className="text-3xl lg:text-4xl font-bold text-center mb-6 text-gray-100 tracking-tight">Eth Ex Blockchain Explorer</h1>
      <div className="w-full relative flex flex-row gap-2 justify-between">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for a wallet/address/ENS/transaction hash/block number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSearch}
          className={`w-52 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${searching ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={searching}
        >
          {searching ? (
            <div className="flex items-center space-x-1">
              <LoaderCircle size={20} className='animate-spin'/>
              <span>Searching</span>
              <div className="animate-bounce">.</div>
              <div className="animate-bounce">.</div>
              <div className="animate-bounce">.</div>
            </div>
          ) : (
            "Search"
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
