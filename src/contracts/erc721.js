import Artifact from '../artifacts/ERC721PayPerMint.json';
import Deploys from '../artifacts/Deploys.json';
import {getWeb3, getAccount, getNetwork} from '../eth/network.js';



// get contract instance
export async function getDeployed()
{
    const web3 = getWeb3();
    const from = await getAccount();
    const network = await getNetwork();
    const address = Deploys[network];
    if (!address) throw new Error(`Could not find address for contract in network ${network}`);
    return ERC721(web3, address, { from });
}


// internal contract instance creation
export default function ERC721(web3,address=null,options={}) 
{
    //const abi = Artifact.compilerOutput.abi;
    const abi = Artifact.abi;
    return new web3.eth.Contract(abi, address, { ...options });
}


    
