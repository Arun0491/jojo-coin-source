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
import erc20Abi from "@/abi/erc20.json";
import { tokenAdd, tokenUsdcAdd, contractAddr, chainId } from "@/config";

export default function UsdcCurrency() {
  const [usdcAmount, setUsdcAmount] = useState("");
  const [usdcErrorMessage, setUsdcErrorMessage] = useState("");
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [isApproved, setIsApproved] = useState(false);

  const { address } = useAccount();

  const balanceUsdc = useBalance({
    address: address,
    token: tokenUsdcAdd,
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

  const usdcBalanceBig = new BigNumber(balanceUsdc.data?.formatted);
  const isValidUsdc = usdcBalanceBig.gte(usdcAmount);

  const { config: approveConfig } = usePrepareContractWrite({
    address: tokenUsdcAdd,
    abi: erc20Abi,
    functionName: "approve",
    args: [contractAddr, parseUnits(usdcAmount, 6)],
    enabled: !!address && !!usdcAmount && !!isValidUsdc,
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

  const allowanceUsdcGet = useContractRead({
    address: tokenUsdcAdd,
    abi: erc20Abi,
    functionName: "allowance",
    enabled: !!address,
    args: [address, contractAddr],
    watch: true,
    chainId: chainId,
  });

  const { config } = usePrepareContractWrite({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "buyTokensWithUSDC",
    args: [parseUnits(usdcAmount, 6)],
    enabled: !!address && !!usdcAmount && !!allowance.gt(0) && !!isValidUsdc,
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
    functionName: "getTokenAmountUSDC",
    args: [parseUnits(usdcAmount, 6)],
    enabled: !!usdcAmount,
    watch: true,
    chainId: chainId,
  });

  const getResult = new BigNumber(getAmount.data);
  const result = isNaN(getResult)
    ? 0
    : getResult.dividedBy(new BigNumber(10).pow(6)).toFixed(3);

  useEffect(() => {
    if (allowanceUsdcGet.data !== undefined) {
      const allowanceValue = new BigNumber(allowanceUsdcGet.data);
      setAllowance(allowanceValue);
      setIsApproved(allowanceValue.gte(usdcAmount));
    }
  }, [address, allowanceUsdcGet.data]);

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

  const handleUsdcAmountChange = (event) => {
    const inputValue = event.target.value;
    const parsedAmount = parseFloat(inputValue);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setUsdcErrorMessage("Amount must be greater than zero");
    } else if (balanceUsdc.data?.formatted < parsedAmount) {
      setUsdcErrorMessage("Insufficient balance.");
    } else {
      setUsdcErrorMessage("");
    }
    setUsdcAmount(inputValue);
    setIsApproved(allowance.gte(parsedAmount));
  };

  return (
    <>
      <div className="vstack gap-2">
        <label>Amount In USDC</label>
        <div className="text-start">
          <div className="input-group with-icon input-group-sm">
            <span className="icon" id="selectedCurrencyIcon">
              <img
                src="assets/images/coin/usdc.svg"
                alt=""
                width="24"
                height="24"
              />
            </span>
            <input
              type="number"
              className="form-control rounded-2 py-3"
              placeholder={0}
              name="usdcAmount"
              value={usdcAmount}
              onChange={handleUsdcAmountChange}
              step="any"
            />
          </div>
          {usdcErrorMessage && (
            <p style={{ color: "red" }} className="error-msg">
              {usdcErrorMessage}
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
