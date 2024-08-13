import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="btn presale-btn"
                  >
                    <span className="button">
                      <span className="button-background"></span>
                      <span className="button-text">Connect Wallet</span>
                    </span>
                  </button>
               
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                  onClick={openChainModal}
                  type="button"
                  className="btn presale-btn"
                >
                  <span className="button">
                      <span className="button-background"></span>
                      <span className="button-text"> Wrong network</span>
                 </span>
                </button>
                );
              }

              return (
                <div>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="btn presale-btn"
                  >
                    <span className="button">
                      <span className="button-background"></span>
                      <span className="button-text">
                        {" "}
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </span>
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
