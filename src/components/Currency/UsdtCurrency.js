import React, { useEffect, useState, useCallback } from "react";
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
import { parseUnits, formatUnits } from "viem";
import presaleAbi from "@/abi/presale.json";
import usdtAbi from "@/abi/usdt.json";
import { tokenAdd, tokenUsdtAdd, contractAddr, chainId } from "@/config";

export default function UsdtCurrency() {
  const [usdtAmount, setUsdtAmount] = useState("");
  const [usdtErrorMessage, setUsdtErrorMessage] = useState("");
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [isApproved, setIsApproved] = useState(false);

  const { address } = useAccount();

  const balanceUsdt = useBalance({
    address: address,
    token: tokenUsdtAdd,
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

  const usdtBalanceBig = new BigNumber(balanceUsdt.data?.formatted);
  const isValidUsdt = usdtBalanceBig.gte(usdtAmount);

  const { config: approveConfig } = usePrepareContractWrite({
    address: tokenUsdtAdd,
    abi: usdtAbi,
    functionName: "approve",
    args: [contractAddr, parseUnits(usdtAmount, 6)],
    enabled: !!address && !!usdtAmount && !!isValidUsdt,
    chainId: chainId,
  });

  const { data: approveData, write: approveWrite } =
    useContractWrite(approveConfig);

  const {
    isLoading: approveIsLoading,
    isSuccess: approveIsSuccess,
    isError: approveIsError,
  } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  const allowanceUsdtGet = useContractRead({
    address: tokenUsdtAdd,
    abi: usdtAbi,
    functionName: "allowance",
    enabled: !!address,
    args: [address, contractAddr],
    watch: true,
    chainId: chainId,
  });

  const { config } = usePrepareContractWrite({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "buyTokensWithUSDT",
    args: [parseUnits(usdtAmount, 6)],
    enabled: !!address && !!usdtAmount && !!allowance.gt(0) && !!isValidUsdt,
    chainId: chainId,
  });

  const { data: purchaseData, write: purchaseWrite } = useContractWrite(config);

  const {
    isLoading: purchaseIsLoading,
    isSuccess: purchaseIsSuccess,
    isError: purchaseIsError,
  } = useWaitForTransaction({
    hash: purchaseData?.hash,
  });

  const getAmount = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "getTokenAmountUSDT",
    args: [parseUnits(usdtAmount, 6)],
    enabled: !!usdtAmount,
    watch: true,
    chainId: chainId,
  });

  const getResult = new BigNumber(getAmount.data);
  const result = isNaN(getResult)
    ? 0
    : getResult.dividedBy(new BigNumber(10).pow(6)).toFixed(3);

  useEffect(() => {
    if (allowanceUsdtGet.data !== undefined) {
      const allowanceValue = new BigNumber(allowanceUsdtGet.data);
      setAllowance(allowanceValue);
      setIsApproved(allowanceValue.gte(usdtAmount));
    }
  }, [address, allowanceUsdtGet.data]);

  useEffect(() => {
    if (purchaseIsSuccess) {
      toast.success(
        <div className="text-center py-2">
          Success! JoJo Purchase Complete
          <div>
            <Link
              style={{ color: "#fff" }}
              href={`https://etherscan.io/tx/${purchaseData?.hash}`}
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
  }, [purchaseIsSuccess, purchaseData?.hash]);

  useEffect(() => {
    if (purchaseIsError) {
      toast.error(
        <div className="text-center py-2">Error! Something Went Wrong</div>
      );
      const timeout = setTimeout(() => {
        toast.dismiss();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [purchaseIsError]);

  useEffect(() => {
    if (purchaseData?.hash) {
      setAllowance(new BigNumber(0));
      setIsApproved(false);
    }
  }, [purchaseData?.hash]);

  const handleUsdtAmountChange = (event) => {
    const inputValue = event.target.value;
    const parsedAmount = parseFloat(inputValue);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setUsdtErrorMessage("Amount must be greater than zero");
    } else if (balanceUsdt.data?.formatted < parsedAmount) {
      setUsdtErrorMessage("Insufficient balance.");
    } else {
      setUsdtErrorMessage("");
    }
    setUsdtAmount(inputValue);
    setIsApproved(allowance.gte(parsedAmount));
  };

  return (
    <>
      <div className="vstack gap-2">
        <label>Amount In USDT</label>
        <div className="text-start">
          <div className="input-group with-icon input-group-sm">
            <span className="icon" id="selectedCurrencyIcon">
              <img
                src="assets/images/coin/usdt.svg"
                alt=""
                width="24"
                height="24"
              />
            </span>
            <input
              type="number"
              className="form-control rounded-2 py-3"
              placeholder={0}
              name="usdtAmount"
              value={usdtAmount}
              onChange={handleUsdtAmountChange}
              step="any"
            />
          </div>
          {usdtErrorMessage && (
            <p style={{ color: "red" }} className="error-msg">
              {usdtErrorMessage}
            </p>
          )}
        </div>
        <label className="mt-3">Amount In JoJo</label>
        <div className="text-start">
          <div className="input-group with-icon input-group-sm">
            <span className="icon">
              <img src="assets/images/no-bg-logo.png" alt="" width="24" height="24" />
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
              {isApproved ? (
                <button
                  type="button"
                  className="btn presale-btn"
                  disabled={!purchaseWrite || purchaseIsLoading}
                  onClick={() => purchaseWrite()}
                >
                  <span className="button">
                    <span className="button-background"></span>
                    <span className="button-text">
                      {purchaseIsLoading ? "Buying..." : "Buy Now"}
                    </span>
                  </span>
                </button>
              ) : (
                <button
                  className="btn presale-btn"
                  disabled={!approveWrite || approveIsLoading}
                  onClick={() => approveWrite()}
                >
                  <span className="button">
                    <span className="button-background"></span>
                    <span className="button-text">
                      {approveIsLoading ? "Approving..." : "Approve"}
                    </span>
                  </span>
                </button>
              )}
            </>
          ) : (
            <div>
              <ConnectWalletButton />
            </div>
          )}
          <Toaster position="top-right" />
        </div>
      </div>
    </>
  );
}
