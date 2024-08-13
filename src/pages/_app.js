import Head from "next/head";
import "@rainbow-me/rainbowkit/styles.css";
import "@/css/style.css";
import "@/css/custom.css";
import ReactGA from "react-ga4";
import toast, { Toaster } from "react-hot-toast";
import {
RainbowKitProvider,
getDefaultWallets,
connectorsForWallets,
darkTheme,
} from "@rainbow-me/rainbowkit";
import {
argentWallet,
trustWallet,
ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "wagmi/chains";
import { infuraProvider } from 'wagmi/providers/infura'

ReactGA.initialize("G-5L5E9WW6QX");
const { chains, publicClient } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: 'cdaaf42c69ac4700814afc2f0a0308b7' })],
  )

const projectId = "7fb83121f24001fe287ad6e719130eab";

const { wallets } = getDefaultWallets({
  appName: "RainbowKit",
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        modalSize="compact"
        chains={chains}
        theme={darkTheme()}
      >
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="assets/images/no-bg-logo.png" />
          <link
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css"
          />
          <title>JoJo Chain</title>
          <meta
            name="description"
            content="Welcome to the official website of JoJo!"
          />

        </Head>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: "",
            duration: 5000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
