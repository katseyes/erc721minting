import React, { Component } from 'react';
import { getDeployed } from './contracts/erc721';
import { hasProvider, getAccount } from './eth/network';
import ERC721 from './components/erc721Comp';
import logo from './logo.svg';
import './App.css';

// TODO
// - copy file KO


// - chainid vs id
// soit trouver le netid dans le deploy
// soit trouver le chain id dans l'appli
//

class App extends React.Component 
{
  constructor(props) {
    super(props)
    this.state ={
    // Set your state here
    }
}

  async componentDidMount() 
  {
    if (hasProvider()) 
    {
      // get contract
      const contract = await getDeployed();
      // get account
      const sender = await getAccount();
      this.setState({ contract, sender });
      // callback for when account changes
      window.ethereum.on('accountsChanged', async (accounts)=>{
        this.setState({ sender: accounts[0] });
      });
    
    }
  }

  render()
  {
    const { contract, sender } = this.state;
    return (
    <div className="App">
    { (hasProvider() && contract && sender)
    ? <ERC721 contract={contract} owner={sender} />
    : <div>Please enable Metamask and reload</div>
    }
    </div>
    );
  }
}


export default App;
