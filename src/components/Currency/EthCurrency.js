import React, { useEffect, useState, useCallback, useMemo } from "react";
import BigNumber from "bignumber.js";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import {
  useAccount,
  useContractWrite,
  useContractRead,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
} from "wagmi";
import { parseUnits, parseEther, formatEther, formatUnits } from "viem";
import presaleAbi from "@/abi/presale.json";
import erc20Abi from "@/abi/erc20.json";
import { tokenAdd, contractAddr, chainId } from "@/config";

export default function EthCurrency() {
  const [ethAmount, setEthAmount] = useState("");
  const [ethErrorMessage, setEthErrorMessage] = useState("");

  const { address } = useAccount();

  const balanceEth = useBalance({
    address: address,
    chainId: chainId,
    enabled: !!address,
    watch: true,
  });

  const balanceToken = useBalance({
    address: address,
    token: tokenAdd,
    chainId: chainId,
    enabled: !!address,
    watch: true,
  });

  const { config } = usePrepareContractWrite({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "buyTokensWithETH",
    value: [parseEther(ethAmount)],
    enabled: !!address && !!ethAmount,
    chainId: chainId,
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
  });

  const getAmount = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "getTokenAmountETH",
    args: [parseEther(ethAmount)],
    enabled: !!ethAmount,
    watch: true,
    chainId: chainId,
  });

  const getEthResult = new BigNumber(getAmount.data);
  const result = isNaN(getEthResult)
    ? 0
    : new BigNumber(getEthResult)
        .dividedBy(new BigNumber(10).pow(18))
        .toFixed(3);

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        <div className="text-center py-2">
          Success! JoJo Purchase Complete
          <div>
            <Link
              style={{ color: "#fff" }}
              href={`https://etherscan.io/tx/${data?.hash}`}
            >
              View On Etherscan
            </Link>
          </div>
        </div>
      );
      const timeout = setTimeout(() => {
        toast.dismiss();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(
        <div className="text-center py-2">Error! Something Went Wrong</div>
      );
      const timeout = setTimeout(() => {
        toast.dismiss();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isError]);

  const handleethAmountChange = useMemo(
    () => (event) => {
      const inputValue = event.target.value;
      const parsedAmount = Number(inputValue);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setEthErrorMessage("Amount must be greater than zero");
      } else if (balanceEth.data?.formatted < parsedAmount) {
        setEthErrorMessage("Insufficient balance.");
      } else {
        setEthErrorMessage("");
      }
      setEthAmount(inputValue);
    },
    []
  );

  return (
    <div className="vstack gap-2">
      <label>Amount In ETH</label>
      <div className="text-start">
        <div className="input-group with-icon input-group-sm">
          <span className="icon" id="selectedCurrencyIcon">
            <img
              src="assets/images/coin/ethereum.png"
              alt=""
              width="24"
              height="24"
            />
          </span>
          <input
            type="number"
            className="form-control rounded-2 py-3"
            placeholder={0}
            name="ethAmount"
            value={ethAmount}
            onChange={handleethAmountChange}
            step="any"
          />
        </div>
        {ethErrorMessage && (
          <p style={{ color: "red" }} className="error-msg">
            {ethErrorMessage}
          </p>
        )}
      </div>
      <label className="mt-3">Amount In JoJo</label>
      <div className="text-start">
        <div className="input-group with-icon input-group-sm">
          <span className="icon">
            <img
              src="assets/images/no-bg-logo.png"
              alt=""
              width="24"
              height="24"
            />
          </span>
          <input
            type="number"
            className="form-control rounded-2 py-3"
            placeholder={result}
            disabled
            readOnly
          />
        </div>
      </div>
      <div className="text-center mt-4">
        {address ? (
          <>
            <button
              type="button"
              className="btn presale-btn"
              disabled={!write || isLoading}
              onClick={() => write()}
            >
              <span className="button">
                <span className="button-background"></span>
                <span className="button-text">
                  {isLoading ? "Buying..." : "Buy Now"}
                </span>
              </span>
            </button>
          </>
        ) : (
          <div>
            <ConnectWalletButton />
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
