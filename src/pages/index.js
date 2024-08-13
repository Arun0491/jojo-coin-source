import React, { useEffect, useState } from "react";
import Link from "next/link";
import BigNumber from "bignumber.js";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { useContractRead, useAccount, useBalance, erc20ABI } from "wagmi";
import presaleAbi from "@/abi/presale.json";
import ChartPie from "@/components/PieChart";
import CountdownTimer from "@/components/CountdownTimers";
import { parseUnits, formatEther, formatUnits } from "viem";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import EthCurrency from "@/components/Currency/EthCurrency";
import UsdtCurrency from "@/components/Currency/UsdtCurrency";
import UsdcCurrency from "@/components/Currency/UsdcCurrency";
import { tokenAdd, contractAddr, chainId } from "@/config";
import { Colors } from "chart.js";
import { useClipboard } from "use-clipboard-copy";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import dynamic from "next/dynamic";

export default function Home() {
  const { address } = useAccount();

  const getTokenBalance = useContractRead({
    address: tokenAdd,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address,
    watch: true,
    chainId: chainId,
  });

  const getCurrentPrice = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "getPriceInUSD",
    watch: true,
    chainId: chainId,
  });

  const getCurrentStage = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "currentStage",
    watch: true,
    chainId: chainId,
  });

  const getStages = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "stages",
    args: [getCurrentStage.data],
    watch: true,
    chainId: chainId,
  });

  const getStagesNext = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "stages",
    args: [parseInt(getCurrentStage.data) + 1],
    watch: true,
    chainId: chainId,
  });

  const getUsdRaised = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "getTotalUSDRaised",
    watch: true,
    chainId: chainId,
  });

  const getTotalSold = useContractRead({
    address: contractAddr,
    abi: presaleAbi,
    functionName: "getTotalSoldTokens",
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

  const leftToken = new BigNumber(getVestingInfo.data?.[0])
    .dividedBy(new BigNumber(10).pow(18))
    .toFixed(3);
  const currenStage = parseInt(getCurrentStage.data) + 1;
  const preSupply = new BigNumber(getStages.data?.[1])
    .dividedBy(new BigNumber(10).pow(18))
    .toFixed(3);
  const totalSold = new BigNumber(getStages.data?.[2])
    .dividedBy(new BigNumber(10).pow(18))
    .toFixed(3);
  const usdTotal = new BigNumber(getUsdRaised.data)
    .dividedBy(new BigNumber(10).pow(18))
    .toFixed(2);
  const currentPrice = new BigNumber(getCurrentPrice.data)
    .dividedBy(new BigNumber(10).pow(18))
    .toFixed(4);
  const nextPrice = new BigNumber(getStagesNext.data?.[0])
    .dividedBy(new BigNumber(10).pow(18))
    .toFixed(4);
  const targetToken = new BigNumber(100000);
  const progressPercentage = (totalSold / preSupply) * 100; // supply current / current sold = %
  const balanceToken = new BigNumber(getTokenBalance.data)
    .dividedBy(new BigNumber(10).pow(18))
    .toFixed(3);
  const [selectedCurrency, setSelectedCurrency] = useState("eth");

  console.log(progressPercentage.toFixed(2));

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const clipboard = useClipboard({
    copiedTimeout: 1000, // timeout duration in milliseconds
  });

  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    speed: 7000,
    autoplaySpeed: 7000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const DynamicLottie = dynamic(() => import("lottie-react"), { ssr: false });
  return (
    <>
      <div className="wrapper d-flex flex-column justify-between">
        <nav
          className="navbar navbar-expand-lg fixed-top bg-dark"
          data-bs-theme="dark"
        >
          <div className="container">
            <Link
              className="navbar-brand presale-btn xs-block"
              href="/"
              style={{ color: "#fff", display: "flex", alignItems: "center" }}
            >

              <img src="assets/images/no-bg-logo.png" alt="logo" />
            </Link>
            <div className="xs-visible text-center xs-btn-position">
              <ConnectWalletButton />
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <div className="navbar-toggler-icon">
                <span />
                <span />
                <span />
              </div>
            </button>
            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav gap-lg-2 gap-xl-5 menu-left">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    target="_blank"
                  >
                    Whitepaper
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="#howtobuy">
                    Contract
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Audit
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="#tokenomics">
                    Tokenomics
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="#roadmap">
                    Roadmap
                  </Link>
                </li>
              </ul>
              <div className="navbar-content-inner ms-lg-auto d-flex flex-column flex-lg-row align-lg-center gap-4 gap-lg-10 p-2 p-lg-0">
                <span className="xs-hidden">
                  <ConnectWalletButton />
                </span>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1  p-t-150">
          <section id="home">
            <div className="container clip-section">
              <div className="row align-center justify-between">
                <div className="col-lg-6 p-4">
                  <div className="xs-align-center">
                    <h2 className="mb-4 position-relative">
                      <div className="title-blur-bg">
                        <span className="title-bg">
                          <span>JoJo</span>
                          {" "}<span>Chain</span>
                        </span>
                        {/* <sup>($MFL)</sup> */}
                      </div>
                      {/* <div className="sub-text">Blockchain solutions</div> */}
                      <div className="sub-text-two text-white">
                        JoJo Chain is a fast, secure, scalable, and low-cost Layer 2 (L2) solution, fully compatible with EVM, built on the One World Chain.
                      </div>
                      {/* <div className="banner-logo"><img src="assets/images/banner-logo.png" /></div> */}
                    </h2>
                    <div className="col-lg-6 xs-visible d-block d-sm-none">
                      <div className="card-panel">
                        <div className="card__glow"></div>
                        <div className="card__bg"></div>
                        <div className="card__front"></div>
                        <div className="card-content">
                          <h4 className="secondary-font-family text-center">Buy JoJo Coin</h4>

                          {/* <CountdownTimer />
                      <br /> */}
                          <div className="total-panel">
                            <div>
                              <div className="raised-text secondary-font-family">Total Raised</div>
                              <div className="raised-color">${usdTotal.toString()}</div>
                            </div>
                            <h5 className="stage-text">Stage {currenStage.toString()}/5</h5>
                            <div className="progress-bg">
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: `${isNaN(progressPercentage.toFixed(2))
                                      ? 0
                                      : progressPercentage.toFixed(2)
                                      }%`,
                                  }}
                                  aria-valuenow={0}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                            </div>
                          </div>

                          {/* {address && (
                      <p align="center">Your available MFL: {balanceToken.toString()}</p>
                      )
                      } */}
                          {address && (
                            <p align="center" className="balance-color">
                              Your JoJo Balance: {leftToken.toString()}
                            </p>
                          )}
                          <div className="divider-with-text p-2">
                            <span>1 JoJo = ${currentPrice.toString()}</span>
                            <span>Next Price: ${nextPrice.toString()}</span>
                          </div>

                          {/* <ClaimToken /> */}
                          {/* <CountdownTimer /> */}

                          <div className="row justify-content-center p-1">
                            <div className="col-lg-4 col-4  btn-c-padding">
                              <button
                                type="button"
                                className={`custom-button ${selectedCurrency === "eth" ? "active" : ""
                                  }`}
                                onClick={() => setSelectedCurrency("eth")}
                              >
                                <img
                                  src="assets/images/coin/ethereum.png"
                                  alt="ETH"
                                  className="img-fluid icon"
                                />
                                <span>ETH</span>
                              </button>
                            </div>
                            <div className="col-lg-4 col-4 btn-c-padding">
                              <button
                                type="button"
                                className={`custom-button ${selectedCurrency === "usdt" ? "active" : ""
                                  }`}
                                onClick={() => setSelectedCurrency("usdt")}
                              >
                                <img
                                  src="assets/images/coin/usdt.svg"
                                  alt="USDT"
                                  className="img-fluid icon"
                                />
                                <span>USDT</span>
                              </button>
                            </div>
                            <div className="col-lg-4 col-4 btn-c-padding">
                              <button
                                type="button"
                                className={`custom-button ${selectedCurrency === "usdc" ? "active" : ""
                                  }`}
                                onClick={() => setSelectedCurrency("usdc")}
                              >
                                <img
                                  src="assets/images/coin/usdc.svg"
                                  alt="USDC"
                                  className="img-fluid icon"
                                />
                                <span>USDC</span>
                              </button>
                            </div>
                          </div>
                          <br />
                          {selectedCurrency === "eth" && <EthCurrency />}
                          {selectedCurrency === "usdt" && <UsdtCurrency />}
                          {selectedCurrency === "usdc" && <UsdcCurrency />}
                        </div>
                      </div>
                    </div>
                    <div className="hero-social">
                      <a
                        className="nav-link"
                        href="https://x.com/JoJo_chain01"
                        target="_blank"
                      >
                        <img
                          src="assets/images/twitter.png"
                          className="socialicon-hover"
                        />
                      </a>
                      <a
                        className="nav-link"
                        href="https://t.me/JoJo_chain"
                        target="_blank"
                      >
                        <img
                          src="assets/images/telegram.png"
                          className="telegram-icon socialicon-hover"
                        />
                      </a>
                      <a
                        className="nav-link"
                        href="#"
                        target="_blank"
                      >
                        <img
                          src="assets/images/github.png"
                          className="telegram-icon socialicon-hover"
                        />
                      </a>
                    </div>
                    <a
                      href="#"
                      target="_blank"
                      className="presale-btn white-btn xs-block"
                    >
                      <span className="button">
                        <span className="button-background"></span>
                        <span className="button-text">Whitepaper</span>
                      </span>
                    </a>
                    <a
                      href="#"
                      className="presale-btn white-btn xs-audit-btn xs-block"
                    >
                      <span className="button">
                        <span className="button-background"></span>
                        <span className="button-text">Audit</span>
                      </span>
                    </a>
                  </div>
                </div>
                <div className="col-lg-6 d-flex flex-end xs-center d-none d-sm-flex">
                  <div className="card-panel">
                    <div className="card__glow"></div>
                    <div className="card__bg"></div>
                    <div className="card__front"></div>
                    <div className="card-content">
                      <h4 className="secondary-font-family text-center secondary-color">Buy JoJo Coin</h4>

                      {/* <CountdownTimer />
                      <br /> */}
                      <div className="total-panel">
                        <div>
                          <div className="raised-text secondary-font-family">Total Raised</div>
                          <div className="raised-color">${usdTotal.toString()}</div>
                        </div>
                        <h5 className="stage-text">Stage {currenStage.toString()}/5</h5>
                        <div className="progress-bg">
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${isNaN(progressPercentage.toFixed(2))
                                  ? 0
                                  : progressPercentage.toFixed(2)
                                  }%`,
                              }}
                              aria-valuenow={0}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>
                      </div>

                      {/* {address && (
                      <p align="center">Your available JoJo: {balanceToken.toString()}</p>
                      )
                      } */}
                      {address && (
                        <p align="center" className="balance-color">
                          Your JoJo Balance: {leftToken.toString()}
                        </p>
                      )}
                      <div className="divider-with-text p-2">
                        <span>1 JoJo = ${currentPrice.toString()}</span>
                        <span>Next Price: ${nextPrice.toString()}</span>
                      </div>

                      {/* <ClaimToken /> */}
                      {/* <CountdownTimer /> */}

                      <div className="row justify-content-center p-1">
                        <div className="col-lg-4 col-4 buy-xs-bottom btn-c-padding">
                          <button
                            type="button"
                            className={`custom-button ${selectedCurrency === "eth" ? "active" : ""
                              }`}
                            onClick={() => setSelectedCurrency("eth")}
                          >
                            <img
                              src="assets/images/coin/ethereum.png"
                              alt="ETH"
                              className="img-fluid icon"
                            />
                            <span>ETH</span>
                          </button>
                        </div>
                        <div className="col-lg-4 col-4 buy-xs-bottom btn-c-padding">
                          <button
                            type="button"
                            className={`custom-button ${selectedCurrency === "usdt" ? "active" : ""
                              }`}
                            onClick={() => setSelectedCurrency("usdt")}
                          >
                            <img
                              src="assets/images/coin/usdt.svg"
                              alt="USDT"
                              className="img-fluid icon"
                            />
                            <span>USDT</span>
                          </button>
                        </div>
                        <div className="col-lg-4 col-4">
                          <button
                            type="button"
                            className={`custom-button ${selectedCurrency === "usdc" ? "active" : ""
                              }`}
                            onClick={() => setSelectedCurrency("usdc")}
                          >
                            <img
                              src="assets/images/coin/usdc.svg"
                              alt="USDC"
                              className="img-fluid icon"
                            />
                            <span>USDC</span>
                          </button>
                        </div>
                      </div>
                      <br />
                      {selectedCurrency === "eth" && <EthCurrency />}
                      {selectedCurrency === "usdt" && <UsdtCurrency />}
                      {selectedCurrency === "usdc" && <UsdcCurrency />}
                    </div>
                  </div>
                </div>
                {/* <div className="gradient_bg">
                  <img
                    src="assets/images/gradient_bg_top.svg"
                    alt="Coin"
                    className="img-fluid"
                  />
                </div> */}
              </div>
            </div>

          </section>
          <div className="container xs-align-center mt-50">
            <svg class="w-full" fill="none" height="15" width="1177" xmlns="http://www.w3.org/2000/svg"><path d="M653.476 7.969h29.202v6.489h-29.202zM.918 7.969H30.12v6.489H.918zM701.334 7.969h29.202v6.489h-29.202zM48.776 7.969h29.202v6.489H48.776zM511 7.965h138.691v6.489H511zM1077.49 7.965h64v6.489h-64zM944.612 7.969h29.202v6.489h-29.202zM690.465 7.969h3.082v6.489h-3.082zM37.907 7.969h3.082v6.489h-3.082zM751.303 7.969h3.082v6.489h-3.082zM98.745 7.969h3.082v6.489h-3.082zM756.333 7.969h3.082v6.489h-3.082zM103.774 7.969h3.082v6.489h-3.082zM868.686 7.969h3.082v6.489h-3.082zM873.715 7.965h3.082v6.489h-3.082zM1145.94 7.965h3.082v6.489h-3.082zM1159.67 7.965h3.082v6.489h-3.082zM1173.41 7.965h3.082v6.489h-3.082zM937.744 7.969h3.082v6.489h-3.082zM821.226 7.969h3.082v6.489h-3.082zM168.668 7.969h3.082v6.489h-3.082z" fill="currentColor"></path><circle cx="843.128" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="916.059" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="979.06" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="847.995" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="920.926" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="983.927" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="852.862" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="925.794" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="988.794" cy="11.37" fill="currentColor" r="1.46"></circle><path d="M1176 1 0 1.01M458.489 1l-12.5 12.5h-230.5" stroke="currentColor" stroke-width="1.5"></path></svg>
          </div>
          <div className="container xs-align-center clip-section mt-50">
            <div className="p-t-80">
              <div className="row align-center">
                <div className="col-lg-12">
                  <h2 className="font-48 text-secondary-color">JoJo Coin</h2>
                  <div className="sub-text text-third-color">
                    Community Rewards
                  </div>
                  <p className="secondary-text-color font-18 m-t-25">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                  </p>
                  <div className="flex-buy">
                    <a
                      href="#home"
                      className="presale-btn wallet-btn mt-5 text-left xs-align-center"
                    >
                      <span className="button">
                        <span className="button-background"></span>
                        <span className="button-text">Buy now</span>
                      </span>
                    </a>
                    <div>
                      <span className="top-social">
                        <a
                          href="https://x.com/JoJo_chain01"
                          target="_blank"
                        >
                          <img
                            src="assets/images/twitter.png"
                            className="socialicon-hover"
                          />
                        </a>
                      </span>
                      <span className="top-social">
                        <a href="https://t.me/JoJo_chain" target="_blank">
                          <img
                            src="assets/images/telegram.png"
                            className="socialicon-hover"
                          />
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div className="col-lg-6">
                  <DynamicLottie
                    animationData={boozeAnimation}
                    loop={true}
                    className="animation-xs"
                    style={{
                      height: "500px",
                      width: "600px",
                      margin: "0 auto",
                    }}
                  />
                </div> */}
              </div>
            </div>
          </div>
          <div className="container xs-align-center mt-50">
            <svg class="w-full" fill="none" height="15" width="1177" xmlns="http://www.w3.org/2000/svg"><path d="M653.476 7.969h29.202v6.489h-29.202zM.918 7.969H30.12v6.489H.918zM701.334 7.969h29.202v6.489h-29.202zM48.776 7.969h29.202v6.489H48.776zM511 7.965h138.691v6.489H511zM1077.49 7.965h64v6.489h-64zM944.612 7.969h29.202v6.489h-29.202zM690.465 7.969h3.082v6.489h-3.082zM37.907 7.969h3.082v6.489h-3.082zM751.303 7.969h3.082v6.489h-3.082zM98.745 7.969h3.082v6.489h-3.082zM756.333 7.969h3.082v6.489h-3.082zM103.774 7.969h3.082v6.489h-3.082zM868.686 7.969h3.082v6.489h-3.082zM873.715 7.965h3.082v6.489h-3.082zM1145.94 7.965h3.082v6.489h-3.082zM1159.67 7.965h3.082v6.489h-3.082zM1173.41 7.965h3.082v6.489h-3.082zM937.744 7.969h3.082v6.489h-3.082zM821.226 7.969h3.082v6.489h-3.082zM168.668 7.969h3.082v6.489h-3.082z" fill="currentColor"></path><circle cx="843.128" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="916.059" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="979.06" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="847.995" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="920.926" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="983.927" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="852.862" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="925.794" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="988.794" cy="11.37" fill="currentColor" r="1.46"></circle><path d="M1176 1 0 1.01M458.489 1l-12.5 12.5h-230.5" stroke="currentColor" stroke-width="1.5"></path></svg>
          </div>
          <div className="container xs-align-center clip-section mt-50">
            <div className="p-t-80">
              <div className="row align-center">
                <div className="col-lg-6">
                  <h2 className="font-48 text-secondary-color">Staking Rewards</h2>

                  <p className="secondary-text-color font-18 m-t-25">
                    JoJo Staking
                    Earn up to 45.07% annually by staking with us.

                    Coins Invest in tokens systematically

                    deep dive before you invest
                    tools to invest regularly and manage risk
                    20+ tokens to invest

                    coin sets
                    Theme-based crypto baskets

                    invest systematically in themes you like
                    diversify for risk management
                    passively re-balanced to keep your investments updated.
                  </p>

                </div>
                <div className="col-lg-6 text-center">
                  <img src="assets/images/staking-banner.jpg" className="staking-image" />
                </div>
              </div>
            </div>
          </div>
          <div className="container xs-align-center mt-50">
            <svg class="w-full" fill="none" height="15" width="1177" xmlns="http://www.w3.org/2000/svg"><path d="M653.476 7.969h29.202v6.489h-29.202zM.918 7.969H30.12v6.489H.918zM701.334 7.969h29.202v6.489h-29.202zM48.776 7.969h29.202v6.489H48.776zM511 7.965h138.691v6.489H511zM1077.49 7.965h64v6.489h-64zM944.612 7.969h29.202v6.489h-29.202zM690.465 7.969h3.082v6.489h-3.082zM37.907 7.969h3.082v6.489h-3.082zM751.303 7.969h3.082v6.489h-3.082zM98.745 7.969h3.082v6.489h-3.082zM756.333 7.969h3.082v6.489h-3.082zM103.774 7.969h3.082v6.489h-3.082zM868.686 7.969h3.082v6.489h-3.082zM873.715 7.965h3.082v6.489h-3.082zM1145.94 7.965h3.082v6.489h-3.082zM1159.67 7.965h3.082v6.489h-3.082zM1173.41 7.965h3.082v6.489h-3.082zM937.744 7.969h3.082v6.489h-3.082zM821.226 7.969h3.082v6.489h-3.082zM168.668 7.969h3.082v6.489h-3.082z" fill="currentColor"></path><circle cx="843.128" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="916.059" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="979.06" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="847.995" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="920.926" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="983.927" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="852.862" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="925.794" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="988.794" cy="11.37" fill="currentColor" r="1.46"></circle><path d="M1176 1 0 1.01M458.489 1l-12.5 12.5h-230.5" stroke="currentColor" stroke-width="1.5"></path></svg>
          </div>
          {/* <div className="container p-t-80 clip-section mt-50">
            <h3 className="text-center font-18">FEATURED IN</h3>
            <div className="slider-top">
              <Slider {...settings}>
                <div>
                  <img
                    src="https://secretswift.com/assets/images/Featured-one.png"
                    className="slider-image"
                  />
                </div>
                <div>
                  <img
                    src="https://secretswift.com/assets/images/Featured-two.png"
                    className="slider-image"
                  />
                </div>
                <div>
                  <img
                    src="https://secretswift.com/assets/images/Featured-three.png"
                    className="slider-image"
                  />
                </div>
                <div>
                  <img
                    src="https://secretswift.com/assets/images/Featured-five.png"
                    className="slider-image"
                  />
                </div>
              </Slider>
            </div>
          </div> */}
          <div className="container clip-section mt-50">
            <div className="p-t-80">
              <div className="row">
                <div className="col-lg-12">
                  <div className="sub-text text-3d m-0">
                    JoJo Game
                  </div>
                  <div className="sub-text text-third-color">
                    Play in Win
                  </div>
                  <p className="secondary-text-color font-18 m-t-25">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="container xs-align-center mt-50">
            <svg class="w-full" fill="none" height="15" width="1177" xmlns="http://www.w3.org/2000/svg"><path d="M653.476 7.969h29.202v6.489h-29.202zM.918 7.969H30.12v6.489H.918zM701.334 7.969h29.202v6.489h-29.202zM48.776 7.969h29.202v6.489H48.776zM511 7.965h138.691v6.489H511zM1077.49 7.965h64v6.489h-64zM944.612 7.969h29.202v6.489h-29.202zM690.465 7.969h3.082v6.489h-3.082zM37.907 7.969h3.082v6.489h-3.082zM751.303 7.969h3.082v6.489h-3.082zM98.745 7.969h3.082v6.489h-3.082zM756.333 7.969h3.082v6.489h-3.082zM103.774 7.969h3.082v6.489h-3.082zM868.686 7.969h3.082v6.489h-3.082zM873.715 7.965h3.082v6.489h-3.082zM1145.94 7.965h3.082v6.489h-3.082zM1159.67 7.965h3.082v6.489h-3.082zM1173.41 7.965h3.082v6.489h-3.082zM937.744 7.969h3.082v6.489h-3.082zM821.226 7.969h3.082v6.489h-3.082zM168.668 7.969h3.082v6.489h-3.082z" fill="currentColor"></path><circle cx="843.128" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="916.059" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="979.06" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="847.995" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="920.926" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="983.927" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="852.862" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="925.794" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="988.794" cy="11.37" fill="currentColor" r="1.46"></circle><path d="M1176 1 0 1.01M458.489 1l-12.5 12.5h-230.5" stroke="currentColor" stroke-width="1.5"></path></svg>
          </div>
          <div className="container clip-section mt-50">
            <div className="p-t-80">
              <div className="row">
                <div className="col-lg-12">
                  <div className="sub-text text-3d m-0">
                    JoJo Pay
                  </div>
                  <p className="secondary-text-color font-18 m-t-25">
                    Experience immediate settlement with zero fees.
                  </p>
                  <p className="secondary-text-color font-18 m-t-25">
                    JoJo Pay, a free and open payments framework on the JoJo Chain, is accessible to millions of businesses through approved app integrations on Online Portals. Designed for rapid transactions, JoJo Pay offers near-zero gas fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="container xs-align-center mt-50">
            <svg class="w-full" fill="none" height="15" width="1177" xmlns="http://www.w3.org/2000/svg"><path d="M653.476 7.969h29.202v6.489h-29.202zM.918 7.969H30.12v6.489H.918zM701.334 7.969h29.202v6.489h-29.202zM48.776 7.969h29.202v6.489H48.776zM511 7.965h138.691v6.489H511zM1077.49 7.965h64v6.489h-64zM944.612 7.969h29.202v6.489h-29.202zM690.465 7.969h3.082v6.489h-3.082zM37.907 7.969h3.082v6.489h-3.082zM751.303 7.969h3.082v6.489h-3.082zM98.745 7.969h3.082v6.489h-3.082zM756.333 7.969h3.082v6.489h-3.082zM103.774 7.969h3.082v6.489h-3.082zM868.686 7.969h3.082v6.489h-3.082zM873.715 7.965h3.082v6.489h-3.082zM1145.94 7.965h3.082v6.489h-3.082zM1159.67 7.965h3.082v6.489h-3.082zM1173.41 7.965h3.082v6.489h-3.082zM937.744 7.969h3.082v6.489h-3.082zM821.226 7.969h3.082v6.489h-3.082zM168.668 7.969h3.082v6.489h-3.082z" fill="currentColor"></path><circle cx="843.128" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="916.059" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="979.06" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="847.995" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="920.926" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="983.927" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="852.862" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="925.794" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="988.794" cy="11.37" fill="currentColor" r="1.46"></circle><path d="M1176 1 0 1.01M458.489 1l-12.5 12.5h-230.5" stroke="currentColor" stroke-width="1.5"></path></svg>
          </div>
          <div className="container clip-section mt-50 roadmap-height" id="roadmap">
            <div className="p-t-80">
              <h3 className="font-48 text-center m-b-50 text-3d">
                ROADMAP
              </h3>
              <div class="timeline-container">
                <div class="timeline-point">
                <p className="q-2025 xs-hidden">Now</p>
                  <div class="popup">
                    <div class="popup-number">1</div>
                    <div class="popup-details">
                      <div class="popup-title">Till now</div>
                         <p>- JoJo Swap Launch</p>
                    </div>
                  </div>
                </div>


                <div class="timeline-point">
                <p className="q-2025 xs-hidden">Q4 - 24</p>
                  <div class="popup">
                    <div class="popup-number">2</div>
                    <div class="popup-details">
                      <div class="popup-title">Q4 - 2024</div>
                      <p>- Token Launch</p>
                    </div>
                  </div>
                </div>


                <div class="timeline-point">
                <p className="q-2025 xs-hidden">Q1 - 25</p>
                  <div class="popup">
                    <div class="popup-number">3</div>
                    <div class="popup-details">
                      <div class="popup-title">Q1 - 2025</div>
                      <p>- Mainnet Launch</p>
                      <p>- JoJo Game Launch</p>
                      <p>- JUSD Stable Coin Launch</p>
                    </div>
                  </div>
                </div>


                <div class="timeline-point">
                <p className="q-2025 xs-hidden">Q2 - 25</p>
                  <div class="popup">
                    <div class="popup-number">4</div>
                    <div class="popup-details">
                      <div class="popup-title">Q2 - 2025</div>
                      <p>- JoJo Pay Launch</p>
                    </div>
                  </div>
                </div>


                <div class="timeline-point">
                <p className="q-2025 xs-hidden">Q3 - 25</p>
                  <div class="popup">
                    <div class="popup-number">5</div>
                    <div class="popup-details">
                      <div class="popup-title">Q3 - 2025</div>
                      <p>- Developer Portal & Eco System Launch</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container xs-align-center mt-50">
            <svg class="w-full" fill="none" height="15" width="1177" xmlns="http://www.w3.org/2000/svg"><path d="M653.476 7.969h29.202v6.489h-29.202zM.918 7.969H30.12v6.489H.918zM701.334 7.969h29.202v6.489h-29.202zM48.776 7.969h29.202v6.489H48.776zM511 7.965h138.691v6.489H511zM1077.49 7.965h64v6.489h-64zM944.612 7.969h29.202v6.489h-29.202zM690.465 7.969h3.082v6.489h-3.082zM37.907 7.969h3.082v6.489h-3.082zM751.303 7.969h3.082v6.489h-3.082zM98.745 7.969h3.082v6.489h-3.082zM756.333 7.969h3.082v6.489h-3.082zM103.774 7.969h3.082v6.489h-3.082zM868.686 7.969h3.082v6.489h-3.082zM873.715 7.965h3.082v6.489h-3.082zM1145.94 7.965h3.082v6.489h-3.082zM1159.67 7.965h3.082v6.489h-3.082zM1173.41 7.965h3.082v6.489h-3.082zM937.744 7.969h3.082v6.489h-3.082zM821.226 7.969h3.082v6.489h-3.082zM168.668 7.969h3.082v6.489h-3.082z" fill="currentColor"></path><circle cx="843.128" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="916.059" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="979.06" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="847.995" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="920.926" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="983.927" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="852.862" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="925.794" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="988.794" cy="11.37" fill="currentColor" r="1.46"></circle><path d="M1176 1 0 1.01M458.489 1l-12.5 12.5h-230.5" stroke="currentColor" stroke-width="1.5"></path></svg>
          </div>
          <div className="container clip-section mt-50" id="howtobuy">
            <div className="p-t-80">
              <h3 className="font-48 text-center m-b-50 text-3d">
                Contract
              </h3>
              <div className="buy-panel">
                <div className="row">
                  <div className="col-lg-4 buy-xs-bottom">
                    {/* <img src="assets/images/wallet.png" className="buy-icon" /> */}
                    <h4 className="buy-title">Address</h4>
                    <div className="copy-flex">
                      <input
                        ref={clipboard.target}
                        value="0xaeA6065786fF1d6DCD7B34AB692426b594406eeb"
                        className="copyInput"
                        readOnly
                        type="text"
                      />
                      <button onClick={clipboard.copy} className="copy-Btn">
                        {clipboard.copied ? (
                          <img src="assets/images/copied.png" alt="logo" />
                        ) : (
                          <img src="assets/images/copy.png" alt="logo" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-3 buy-xs-bottom">
                    {/* <img src="assets/images/wallet.png" className="buy-icon" /> */}
                    <h4 className="buy-title">Network</h4>
                    <p className="buy-content">Ethereum Chain (ERC20)</p>
                  </div>
                  <div className="col-lg-3 buy-xs-bottom">
                    {/* <img src="assets/images/wallet.png" className="buy-icon" /> */}
                    <h4 className="buy-title">Token Symbol</h4>
                    <p className="buy-content">JoJo</p>
                  </div>
                  <div className="col-lg-2">
                    {/* <img src="assets/images/wallet.png" className="buy-icon" /> */}
                    <h4 className="buy-title">Decimal</h4>
                    <p className="buy-content">18</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container xs-align-center mt-50">
            <svg class="w-full" fill="none" height="15" width="1177" xmlns="http://www.w3.org/2000/svg"><path d="M653.476 7.969h29.202v6.489h-29.202zM.918 7.969H30.12v6.489H.918zM701.334 7.969h29.202v6.489h-29.202zM48.776 7.969h29.202v6.489H48.776zM511 7.965h138.691v6.489H511zM1077.49 7.965h64v6.489h-64zM944.612 7.969h29.202v6.489h-29.202zM690.465 7.969h3.082v6.489h-3.082zM37.907 7.969h3.082v6.489h-3.082zM751.303 7.969h3.082v6.489h-3.082zM98.745 7.969h3.082v6.489h-3.082zM756.333 7.969h3.082v6.489h-3.082zM103.774 7.969h3.082v6.489h-3.082zM868.686 7.969h3.082v6.489h-3.082zM873.715 7.965h3.082v6.489h-3.082zM1145.94 7.965h3.082v6.489h-3.082zM1159.67 7.965h3.082v6.489h-3.082zM1173.41 7.965h3.082v6.489h-3.082zM937.744 7.969h3.082v6.489h-3.082zM821.226 7.969h3.082v6.489h-3.082zM168.668 7.969h3.082v6.489h-3.082z" fill="currentColor"></path><circle cx="843.128" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="916.059" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="979.06" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="847.995" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="920.926" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="983.927" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="852.862" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="925.794" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="988.794" cy="11.37" fill="currentColor" r="1.46"></circle><path d="M1176 1 0 1.01M458.489 1l-12.5 12.5h-230.5" stroke="currentColor" stroke-width="1.5"></path></svg>
          </div>
          <div className="container clip-section mt-50" id="tokenomics">
            <div className="p-t-80">
              <h3 className="font-48 text-center m-b-50 text-3d">
                Tokenomics
              </h3>
            </div>
            <div className="table-border">
              <table className="table">
                <thead>
                  {/* <tr>
                    <th scope="col">#</th>
                    <th scope="col">Total Tokens</th>
                    <th scope="col" className="value-th">
                      1,000,000,000
                    </th>
                  </tr> */}
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Adviser</td>
                    <td>2%</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Presale</td>
                    <td>10%</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>Liquidity</td>
                    <td>10%</td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>Eco System</td>
                    <td>10%</td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>Protocol Developer</td>
                    <td>8%</td>
                  </tr>
                  <tr>
                    <th scope="row">6</th>
                    <td>Fundation</td>
                    <td>12%</td>
                  </tr>
                  <tr>
                    <th scope="row">7</th>
                    <td>Marketing & Operional</td>
                    <td>10%</td>
                  </tr>
                  <tr>
                    <th scope="row">8</th>
                    <td>Team</td>
                    <td>10%</td>
                  </tr>
                  <tr>
                    <th scope="row">9</th>
                    <td>Public</td>
                    <td>28%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* <div className="position-relative">
              <DynamicLottie
                animationData={piechart}
                loop={true}
                className="animation-xs piechartCenter"
                style={{ height: "500px", width: "500px" }}
              />
              <div className="font-26 position-one coin-bg">
                Presale <span className="xs-visible xs-inline">- 20%</span>
              </div>
              <div className="font-26 position-six coin-bg">
                Community & Staking Rewards{" "}
                <span className="xs-visible xs-inline">- 20%</span>
              </div>
              <div className="font-26 position-two coin-bg">
                CEX & DEX listing{" "}
                <span className="xs-visible xs-inline">- 10%</span>
              </div>
              <div className="font-26 position-three coin-bg">
                Liquidity <span className="xs-visible xs-inline">- 25%</span>
              </div>
              <div className="font-26 position-four coin-bg">
                Product Development
                <span className="xs-visible xs-inline">- 10%</span>
              </div>
              <div className="font-26 position-five coin-bg">
                Marketing
                <span className="xs-visible xs-inline">- 15%</span>
              </div>
            </div> */}
          </div>
          {/* <div className="container">
            <div className="p-t-80">
              <h3 className="font-48 text-center m-b-50 text-3d">
                JoJo TOKEN DISTRIBUTION
              </h3>
            </div>
            <div className="table-border">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Total Tokens</th>
                    <th scope="col" className="value-th">
                      1,000,000,000
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Presale</td>
                    <td>200,000,000</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Community & Staking Rewards</td>
                    <td>200,000,000</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>CEX & DEX listing</td>
                    <td>100,000,000</td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>Liquidity</td>
                    <td>250,000,000</td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>Product Development</td>
                    <td>100,000,000</td>
                  </tr>
                  <tr>
                    <th scope="row">6</th>
                    <td>Marketing</td>
                    <td>150,000,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}
            <div className="container xs-align-center mt-50">
            <svg class="w-full" fill="none" height="15" width="1177" xmlns="http://www.w3.org/2000/svg"><path d="M653.476 7.969h29.202v6.489h-29.202zM.918 7.969H30.12v6.489H.918zM701.334 7.969h29.202v6.489h-29.202zM48.776 7.969h29.202v6.489H48.776zM511 7.965h138.691v6.489H511zM1077.49 7.965h64v6.489h-64zM944.612 7.969h29.202v6.489h-29.202zM690.465 7.969h3.082v6.489h-3.082zM37.907 7.969h3.082v6.489h-3.082zM751.303 7.969h3.082v6.489h-3.082zM98.745 7.969h3.082v6.489h-3.082zM756.333 7.969h3.082v6.489h-3.082zM103.774 7.969h3.082v6.489h-3.082zM868.686 7.969h3.082v6.489h-3.082zM873.715 7.965h3.082v6.489h-3.082zM1145.94 7.965h3.082v6.489h-3.082zM1159.67 7.965h3.082v6.489h-3.082zM1173.41 7.965h3.082v6.489h-3.082zM937.744 7.969h3.082v6.489h-3.082zM821.226 7.969h3.082v6.489h-3.082zM168.668 7.969h3.082v6.489h-3.082z" fill="currentColor"></path><circle cx="843.128" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="916.059" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="979.06" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="847.995" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="920.926" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="983.927" cy="11.374" fill="currentColor" r="1.46"></circle><circle cx="852.862" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="925.794" cy="11.37" fill="currentColor" r="1.46"></circle><circle cx="988.794" cy="11.37" fill="currentColor" r="1.46"></circle><path d="M1176 1 0 1.01M458.489 1l-12.5 12.5h-230.5" stroke="currentColor" stroke-width="1.5"></path></svg>
          </div>

         
          <div className="footer-bg">
            <div className="container">
              <div className="text-center">
                <div>JOJO CHAIN LIMITED.</div>
                <div>55 Peachfield Road, Cellan, United Kingdom, SA48 0HX.</div>
                <div className="copyRight">
                  &copy; 2024 JoJo Chain.
                </div>
                <div className="font-bold m-t-40">DISCLAIMER</div>
                <div>
                  Cryptocurrency investments carry a high risk of volatility. Be
                  aware of the tax implications, as profits may be subject to
                  capital gains or other taxes in your jurisdiction.
                  Cryptocurrency regulations can vary, so ensure you understand
                  the rules in your area. Conduct thorough research and invest
                  only what you can afford to lose.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
