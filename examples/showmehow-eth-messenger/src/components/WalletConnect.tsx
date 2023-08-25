import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LinkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Notification } from "./Notification";
import { useWallet } from "../hooks/useWallet";

export const WalletConnect: React.FC = () => {
  const { error, isLoading } = useWallet();

  if (error) {
    return (
      <Notification
        icon={<ExclamationTriangleIcon />}
        title="Error connecting to wallet"
        cta={<ConnectButton />}>
        Try connecting again
      </Notification>
    );
  }

  if (isLoading) {
    return (
      <Notification icon={<LinkIcon />} title="Connecting to wallet">
        Awaiting wallet connection...
      </Notification>
    );
  }

  return (
    <Notification
      icon={<LinkIcon />}
      title="No wallet connected"
      cta={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ order: 1, alignSelf: 'center' }}>
            <ConnectButton />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', order: 2, marginTop: '10px' }}>
            <span>Powered by: </span>
            <a href="https://github.com/xmtp/xmtp-web" style={{ textDecoration: 'underline', marginLeft: '5px' }}>XMTP</a>
            <img src="/xmtp-icon.png" alt="XMTP Logo" width="32" style={{ marginLeft: '10px' }} />
          </div>
        </div>
      }
    >
      Please connect a wallet to begin
    </Notification>
);


};
