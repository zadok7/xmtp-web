import {
  isValidAddress,
  useCanMessage,
  useStartConversation,
} from "@xmtp/react-sdk";
import { MessageInput } from "@xmtp/react-components";
import type { CachedConversation } from "@xmtp/react-sdk";
import { useCallback, useEffect, useState } from "react";
import "./NewMessage.css";

type NewMessageProps = {
  onSuccess?: (conversation?: CachedConversation) => void;
};

export const NewMessage: React.FC<NewMessageProps> = ({ onSuccess }) => {
  const [peerAddress] = useState(import.meta.env.VITE_TARGET_WALLET_ADDRESS);
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { startConversation } = useStartConversation();
  const { canMessage } = useCanMessage();

  const handleStartConversation = useCallback(
    async (message: string) => {
      if (peerAddress && isOnNetwork) {
        setIsLoading(true);
        const result = await startConversation(peerAddress, message);
        setIsLoading(false);
        if (result) {
          onSuccess?.(result.cachedConversation);
        }
      }
    },
    [isOnNetwork, onSuccess, peerAddress, startConversation],
  );

  useEffect(() => {
    const checkAddress = async () => {
      if (isValidAddress(peerAddress)) {
        setIsLoading(true);
        setIsOnNetwork(await canMessage(peerAddress));
        setIsLoading(false);
      } else {
        setIsOnNetwork(false);
      }
    };
    void checkAddress();
  }, [canMessage, peerAddress]);

  return (
    <>
      <div className="TargetAddressDisplay">
      <strong>Message to: </strong>{peerAddress}
      </div>
      <div className="NewMessageInputWrapper">
        <MessageInput
          isDisabled={isLoading || !isValidAddress(peerAddress) || !isOnNetwork}
          onSubmit={handleStartConversation}
        />
      </div>
    </>
  );
};
