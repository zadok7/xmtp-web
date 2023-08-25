# showmehow.eth messenger

![Status](https://img.shields.io/badge/Project_Status-Beta-yellow)


This is a modification to the [react-quickstart example](https://github.com/xmtp/xmtp-web/tree/main/examples/react-quickstart) provided from [xmtp/xmtp-web](https://github.com/xmtp/xmtp-web). What this modified project does is allow users to initiate an XMTP chat with just your wallet address you specify. You can deploy this to IPFS and setup your [ENS](https://app.ens.domains) name's `contenthash` record to point to your IPFS hash so that this all runs from a decentralized website. We'll also be using the [.LIMO resolver](https://eth.limo) so users can easily browser and chat with you through a decentralized website. You can test is out at [chat.showmehow.eth.limo](https://chat.showmehow.eth.limo).

To read your own messages use an app that connects to the XMTP network. For instance you can use [Coinbase Wallet](https://www.coinbase.com/wallet) to see anyone who has messaged you. You can also see those same messages on [xmtp.chat](https://xmtp.chat/inbox). The user who initiated the chat with you can see the messages in XMTP enabled applications, OR by visiting again wherever you have deployed this chat. If they visit your deployment they will see only a chat with you (eg. `TARGET_WALLET_ADDRESS` you specify in the .env variable file).

This app is in **beta** status and ready to serve as a reference for you to start building with.

However, we do not recommend using beta software in production apps.

To keep up with the latest quickstart app developments, see the [Issues tab](https://github.com/xmtp/xmtp-web/issues) in this repo.

To learn more about XMTP and get answers to frequently asked questions, see the [XMTP documentation](https://xmtp.org/docs).

### Setting up Environment Variables

Before running the project, you need to set up the environment variables. Create a `.env` file in the root directory of your project and add the following:

```env
VITE_PROJECT_ID=WALLETCONNECT_PROJECT_ID
VITE_TARGET_WALLET_ADDRESS=0x_WALLET_ADDRESS
VITE_ALCHEMY_API_KEY=ALCHEMY_API_KEY
VITE_ALCHEMY_NETWORK=ALCHEMY_NETWORK
```
- WALLETCONNECT_PROJECT_ID = Get this from [https://cloud.walletconnect.com/app](https://cloud.walletconnect.com/app)
- 0x_WALLET_ADDRESS = THe Ethereum address you want to receive messages at. This is the only address users will be able to message.
- ALCHEMY_API_KEY = Visit [dashboard.alchemy.com/apps](https://dashboard.alchemy.com/apps) to get a free API key. We're using it to detect if the `TARGET_WALLET_ADDRESS` has an ENS Primary name and Avatar so we can display that to the user.
- ALCHEMY_NETWORK = This should probably be `homestead` which is Mainnet.

## Developing

1. In `packages/react-sdk`, run `yarn build` to build the SDK.

2. In `examples/showmehow-eth-messenger`, run `yarn dev` to start developing.

## Useful commands

- `yarn build`: Builds the example app
- `yarn clean`: Removes `node_modules`, `dist`, and `.turbo` folders
- `yarn dev`: Launches the example app and watches for changes, which will trigger a rebuild
- `yarn format`: Runs prettier format and write changes
- `yarn format:check`: Runs prettier format check
- `yarn lint`: Runs ESLint
- `yarn typecheck`: Runs `tsc`

## Deploying on IPFS and LIMO

- In `examples/showmehow-eth-messenger`, run `yarn build`.
- Navigate to the `dist` folder after the build and open the index.html file. You will find two references to `"/assets/..."`. To fix these, ensure they have relative links. Add a `.` in front of them so they appear as `"./assets/..."`.
- Setup the `contenthash` record for your ENS name on the [ENS Managr App](https://app.ens.domains)

![image](https://github.com/zadok7/xmtp-web/assets/88821511/740b44e2-fd1c-42b0-9a1f-421aa4bfbb6c)

- Restrict access to your Alchemy API Key so it can only be used with your ENS name via .LIMO resolver

![image](https://github.com/zadok7/xmtp-web/assets/88821511/e4ed9b95-4fb9-42d2-8e83-96fa07c6fea1)

> ⚠️ **Public Visibility of API Keys** 
>
> Please be aware that any API keys included in this static front-end code will be publicly visible when hosted on IPFS or elsewhere.


