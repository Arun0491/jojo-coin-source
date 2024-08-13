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
import { tokenAdd, tokenUsdtAdd, contractAddr, chainId } from "@/config";

const ClaimToken = () => {
  const { address } = useAccount();

  const getIsClaimEnabled = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "isClaimEnabled",
    watch: true,
    chainId: chainId,
  });

  const getVestingRate = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "vestingRate",
    watch: true,
    chainId: chainId,
  });

  const getVestingInfo = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "vestingInfo",
    enabled: !!address,
    args: [address],
    watch: true,
    chainId: chainId,
  });

  const { config } = usePrepareContractWrite({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "claimReleasedAmount",
    enabled: !!address,
    chainId: chainId,
  });

  const leftToken = new BigNumber(getVestingInfo.data?.[0]).dividedBy(new BigNumber(10).pow(18)).toFixed(3);
  const Rate = new BigNumber(getVestingRate.data);

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        <div className="text-center py-2">
          Success! Token has been claimed.
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

  return (
    <div className="text-center">
      {getIsClaimEnabled.data === false ? (
        <>
          <button type="button" className="btn presale-btn" disabled>
            <span className="button">
              <span className="button-background"></span>
              <span className="button-text">Claim Has Been Disabled</span>
            </span>
          </button>
        </>
      ) : (
        <>
          {address && (
            <>
              <br />
              <p>
                Left JoJO Amount: {leftToken.toString()}
              </p>
              <p>
                Claim Rate: {Rate.toString()}% of 100%
              </p>
              <button
                type="button"
                className="btn presale-btn"
                disabled={!write || isLoading}
                onClick={() => write()}
              >
                <span className="button">
                  <span className="button-background"></span>
                  <span className="button-text">
                    {isLoading ? "Claiming..." : "Claim Now"}
                  </span>
                </span>
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ClaimToken;
