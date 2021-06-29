// src/eth/network.js
import Web3 from 'web3';
import { ethers } from 'ethers'
let web3;

export function getWeb3() {
    if (!web3) {
        web3 = new Web3(Web3.givenProvider);
    }

    return web3;
}

export function hasProvider()
{
    return !!Web3.givenProvider;
}

export async function getAccount()
{
    const accounts = await window.ethereum.enable();
    return accounts[0];
}

export async function getBlockNumber()
{
    return web3.eth.getBlockNumber();
}

export async function getNetwork()
{
    // used to get contract address as deployed with my script
    // as it's using ethers it's chainId (not the same as web which gives networkid)
    // --> so I have to use ethers here
    // KO / chainid
    //return web3.eth.net.getId();

    // I call this first just in case it wasn't already called
    // because I think I need the ethereum.enable()
    const from = await getAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const network = await provider.getNetwork();
    const nw = network.chainId;
    return nw;
    
}