import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadWeb3, loadAccount, loadTokensList, loadExchange, loadExchangeData } from '../store/interactions';
import { getAccount } from '../store/slices/account';
import { getTradePair } from '../store/slices/tradePair';
import { Responsive, WidthProvider } from 'react-grid-layout';
import TradeCard from './TradeCard';
import BalanceCard from './BalanceCard';
import TransactionsCard from './TransactionsCard';
import OrderbookCard from './OrderbookCard';
import { Card } from 'antd-mobile';
import OrderCard from './OrderCard';
import ChartCard from './ChartCard';

const layouts = {
  lg: [
      {i: 'a', x: 0, y: 0, w: 2, h: 2},
      {i: 'b', x: 0, y: 2, w: 2, h: 2},
      {i: 'c', x: 2, y: 0, w: 2, h: 4},
      {i: 'd', x: 4, y: 0, w: 4, h: 2},
      {i: 'e', x: 4, y: 2, w: 4, h: 2},
      {i: 'f', x: 8, y: 0, w: 2, h: 4}
    ],
  md: [
      {i: 'a', x: 0, y: 0, w: 2, h: 15},
      {i: 'b', x: 0, y: 15, w: 2, h: 15},
      {i: 'c', x: 2, y: 0, w: 2, h: 30},
      {i: 'd', x: 4, y: 0, w: 4, h: 15},
      {i: 'e', x: 4, y: 15, w: 4, h: 15},
      {i: 'f', x: 8, y: 0, w: 2, h: 15}
    ],
  sm: [
      {i: 'a', x: 0, y: 0, w: 2, h: 15},
      {i: 'b', x: 0, y: 15, w: 2, h: 15},
      {i: 'c', x: 2, y: 0, w: 2, h: 30},
      {i: 'd', x: 4, y: 0, w: 4, h: 15},
      {i: 'e', x: 4, y: 15, w: 4, h: 15},
      {i: 'f', x: 8, y: 0, w: 2, h: 15}
    ]
}

function App() {
  const dispatch = useDispatch();
  const account = useSelector(getAccount);
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [loaded, setLoaded] = useState(false);

  const loadBlockchainData = async () => {
    //Connect to Metamask and Save to redux as logged in
    const web3 = await loadWeb3(dispatch)
    //Get eth network
    await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()

    if (networkId !== "1") {
      alert("NOT ON MAINNET")
    }

    //Save erc20 token address coingecko list Redux
    let allTokens = await loadTokensList(web3, dispatch)
    //Save account address, ether balance, tokens balance to Redux
    let userAddress = await loadAccount(web3, allTokens, dispatch)

    //load exchange contract
    const exchange = await loadExchange(web3, networkId)
    if (!exchange) {
      window.alert('Exchange smart contract not detected on current network. Please select another network on Metamask.')
    }
    //Save exchange balances of user ether and tokens to redux
    //load from exchange current trade pair orderbook
    const balances = await loadExchangeData(web3, exchange, userAddress, allTokens, dispatch)

    setLoaded(true)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])


  return (
    <div className="App">
      <button>{account.address ? account.address : 'login to metamask'}</button>
      {
        loaded
        ?
        <ResponsiveGridLayout  className="layouts" layouts={layouts}
          breakpoints={{lg: 1200, md: 300, sm: 0}}
          cols={{lg: 10, md: 6, sm: 2}}>
          <div key="a"><BalanceCard/></div>
          <div key="b"><OrderCard/></div>
          <div key="c"><OrderbookCard/></div>
          <div key="d"><ChartCard/></div>
          <div key="e"><Card><TransactionsCard/></Card></div>
          <div key="f"><TradeCard/></div>
        </ResponsiveGridLayout >
        :
        null
      }

    </div>
  );
}

export default App;
