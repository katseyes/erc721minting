import React, { Component } from 'react';
import { getBlockNumber } from '../eth/network';
import { getGasPrice } from '../eth/gasPrice';
import {mint } from './mintComp';
import BN from 'bignumber.js';


class ERC721 extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {tokens: [],loading: true};
        // why??
        this.mint = this.mint.bind(this);
        this.canMint = this.canMint.bind(this);

    }

    async componentDidMount() 
    {
        const currentBlock = await getBlockNumber();
        const tokenIds = await this.getTokensAtBlock(currentBlock);
        const tokens = tokenIds.map(id => ({id, confirmed: true}));
        this.setState({ tokens, loading: false });
    }
    
    
    render() 
    {
        const { tokens, loading } = this.state;
        if (loading) return "Loading";
        return (
        <div>
            <h1>Collectible Numbers</h1>
            <div>
                { tokens.map(token => 
                    (
                    <div key={token.id.toString()}>
                    { token.id.toString() }
                    </div>
                    ))
                }
                <Mint canMint={this.canMint} mint={this.mint} />
            </div>
        </div>
        );
    }



    async getTokensAtBlock(blockNumber) 
    {
       // return [];
        const { contract, owner } = this.props;
        // Load number of tokens of the user
        const strBalance = await contract.methods.balanceOf(owner).call({}, blockNumber);
        const balance = parseInt(strBalance);

        // Retrieve the id of every token
        const queries = Array.from({length: balance}, (_,index)=>(contract.methods.tokenOfOwnerByIndex(owner,index).call({}, blockNumber)));
        return await Promise.all(queries);
    }

    async canMint(id)
    {
        const { contract } = this.props;
        const exists = await contract.methods.exists(id).call();
        return !exists;
    }

    async mint(id) 
    {
        const { contract, owner } = this.props;
        const from = owner;
        const value = new BN(id).shiftedBy(12).toString(10);
        const gasPrice = await getGasPrice();
        const gas = await contract.methods.mint(owner, id).estimateGas({ value, from });
        contract.methods.mint(owner, id).send({ value, gas, gasPrice, from });
    }


}

export default ERC721;