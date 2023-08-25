import { useState, useEffect } from 'react';
import { AlchemyProvider } from "@ethersproject/providers";
import { is0xAddress, isEns } from '../helpers/EnsStringHelpers';  // Import the helper functions

// Use the environment variables
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY as string;
const ALCHEMY_NETWORK = import.meta.env.VITE_ALCHEMY_NETWORK as string;

const provider = new AlchemyProvider(ALCHEMY_NETWORK, ALCHEMY_API_KEY);

const useEns = (addressOrName: string | undefined) => {
  const [address, setAddress] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const probableAddress = addressOrName && is0xAddress(addressOrName) ? addressOrName : undefined;
  const probableName = addressOrName && isEns(addressOrName) ? addressOrName : undefined;

  useEffect(() => {
    const fetchENS = async () => {
      try {
        if (probableAddress) {
          const name = await provider.lookupAddress(probableAddress);
          setEnsName(name || null);
          setAddress(probableAddress);
        } else if (probableName) {
          const resolvedAddress = await provider.resolveName(probableName);
          setAddress(resolvedAddress || null);
          setEnsName(probableName);
        }

        if (ensName) {
            const probableAvatarUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
            fetch(probableAvatarUrl)
                .then(response => {
                    if (response.ok) {
                        setAvatarUrl(probableAvatarUrl);
                    } else {
                        setAvatarUrl(null);
                    }
                })
                .catch(() => {
                    setAvatarUrl(null);
                });
        }

      } catch (err: any) {
        setError(`Failed to resolve ENS for ${addressOrName}. Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchENS();
  }, [addressOrName, ensName]);

  return { address, ensName, loading, error, avatarUrl };
}

export default useEns;
