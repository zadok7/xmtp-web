import "./Inbox.css";
import { useCallback, useState, useEffect } from "react";
import { type CachedConversation, useConversations } from "@xmtp/react-sdk";
import {
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Messages } from "./Messages";
import { NewMessage } from "./NewMessage";
import { useWallet } from "../hooks/useWallet";
import { NoSelectedConversationNotification } from "./NoSelectedConversationNotification";
import useEns from "../hooks/useEns"; // <-- Import the useEns hook

export const Inbox: React.FC = () => {
  const { disconnect } = useWallet();
  const [selectedConversation, setSelectedConversation] = useState<
    CachedConversation | undefined
  >(undefined);
  const [isNewMessage, setIsNewMessage] = useState(false);

  // Fetching the list of conversations
  const { conversations } = useConversations();
  
  // Using the ENS hook to get the ENS name and avatar URL for the target address
  const { ensName, avatarUrl } = useEns(import.meta.env.VITE_TARGET_WALLET_ADDRESS);

  useEffect(() => {
    const existingConversation = conversations.find(convo => convo.peerAddress === import.meta.env.VITE_TARGET_WALLET_ADDRESS);
    if (existingConversation) {
      setSelectedConversation(existingConversation);
    }
  }, [conversations]);

  const handleConversationClick = useCallback((convo: CachedConversation) => {
    setSelectedConversation(convo);
    setIsNewMessage(false);
  }, []);

  const handleStartNewConversation = useCallback(() => {
    setIsNewMessage(true);
  }, []);

  const handleStartNewConversationSuccess = useCallback(
    (convo?: CachedConversation) => {
      setSelectedConversation(convo);
      setIsNewMessage(false);
    },
    []
  );

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (
    <div className="Inbox">
      <div className="InboxHeader">
        <div className="InboxHeader__xmtp">
          {/* Display ENS avatar if it exists */}
          {avatarUrl && 
            <img className="avatar" src={avatarUrl} alt="ENS Avatar" width="48" />
          }
          {/* Display ENS name if it exists */}
          {ensName && <span>{ensName}</span>}
        </div>
        <div className="InboxHeader__actions">
          <button
            className="Button Button--secondary"
            type="button"
            onClick={handleDisconnect}>
            <ArrowRightOnRectangleIcon width={24} /> Disconnect
          </button>
        </div>
      </div>
      <div className="InboxConversations">
        <div className="InboxConversations__messages">
          {isNewMessage ? (
            <NewMessage onSuccess={handleStartNewConversationSuccess} />
          ) : selectedConversation ? (
            <Messages conversation={selectedConversation} />
          ) : (
            <NoSelectedConversationNotification
              onStartNewConversation={handleStartNewConversation}
            />
          )}
        </div>
      </div>
    </div>
  );
};
