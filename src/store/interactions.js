import Web3 from 'web3';
import web3Slice from '../store/slices/web3';
import accountSlice from '../store/slices/account';
import tokenListSlice from '../store/slices/tokenList';
import tradePairSlice from '../store/slices/tradePair';
import exchangeSlice from '../store/slices/exchange';
import axios from 'axios';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import moment from 'moment';

export const loadWeb3 = async (dispatch) => {
  if(typeof window.ethereum!=='undefined'){
    const web3 = new Web3(window.ethereum)
    dispatch(web3Slice.actions.set())
    return web3
  } else {
    window.alert('Please install MetaMask')
    window.location.assign("https://metamask.io/")
  }
}

export const loadAccount = async (web3, allTokens, dispatch) => {
  const accounts = await web3.eth.getAccounts()
  const account = accounts[0]
  if(typeof account !== 'undefined'){
    //account's ether balance
    const ethBalance = await web3.eth.getBalance(account)
    //account's token balance
    let tokenBalances = [];
    const getAllTokens = allTokens.map(async (contract) => {
      // Init token by contract address
      const token = new web3.eth.Contract(Token.abi, contract.address)
      //get tokenbalance of account
      const tokenBalance = await token.methods.balanceOf(account).call()
      //save somewhre
      if (tokenBalance !== "0") {
        tokenBalances.push({ chainId: contract.chainId, decimals: contract.decimals, logoURI: contract.logoURI, address: contract.address, symbol: contract.symbol, name: contract.name, balance: tokenBalance})
      }
    })
    await Promise.all(getAllTokens)
    console.log('dun')

    dispatch(accountSlice.actions.set({address: account, ethBalance: ethBalance, tokens: tokenBalances}))

    return account
  } else {
    window.alert('Please login with MetaMask')
    return null
  }
}

export const loadTokensList = async (web3, dispatch) => {
  try {


    //Change back later (FOR MORE COINS)
    // const tokenList = await axios.get('https://tokens.coingecko.com/uniswap/all.json')
    // dispatch(tokenListSlice.actions.set(tokenList.data.tokens))

    const tokenList = [{
      chainId: 1,
      address: Token.networks['5777'].address,
      name: 'testCoin',
      symbol: 'TEST',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/193/thumb/XlQmXoU.png?1595304945'
    }]

    dispatch(tokenListSlice.actions.set(tokenList))
    ////////////////////////////////////////////////////////////

    return tokenList
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}

export const loadExchange = async (web3, networkId) => {
  try {
    //exchange instance
    console.log(Exchange.abi)
    console.log(Exchange.networks[networkId].address)

    const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)

    console.log(exchange)

    return exchange
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}

const formatOrders = (orders) => {
  orders.forEach(order => {
    if (order.tokenGive === '0x0000000000000000000000000000000000000000') {
      order.etherAmount = order.amountGive
      order.tokenAmount = order.amountGet
    }
    else {
      order.etherAmount = order.amountGet
      order.tokenAmount = order.amountGive
    }
    order.tokenPrice  = Math.round(order.etherAmount / order.tokenAmount * 100000) / 100000
    order.formattedTimestamp = moment.unix(order.timestamp).format('h:mm:ss a M/D')
  })
}

export const loadExchangeData = async (web3, exchange, userAddress, allTokens, dispatch) => {

  try {
    //userEth
    const exchangeEtherBalance = await exchange.methods.balanceOf('0x0000000000000000000000000000000000000000', userAddress).call()

    const exchangeTokenBalances = [];

    //userEth
    const getExchangeTokens = allTokens.map(async (contract) => {
      //get tokenbalance of account
      const tokenBalance = await exchange.methods.balanceOf(contract.address, userAddress).call()
      //save somewhre
      if (tokenBalance !== "0") {
        exchangeTokenBalances.push({ chainId: contract.chainId, decimals: contract.decimals, logoURI: contract.logoURI, address: contract.address, symbol: contract.symbol, name: contract.name, balance: tokenBalance})
      }
    })
    await Promise.all(getExchangeTokens)

    const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest'})
    const cancelledOrders = cancelStream.map(orders => orders.returnValues)

    const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest'})
    const filledOrders = tradeStream.map(orders => orders.returnValues)

    const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest'})
    const allOrders = orderStream.map(orders => orders.returnValues).sort((a,b) => a.timestamp - b.timestamp)

    formatOrders(allOrders)
    formatOrders(filledOrders)
    formatOrders(cancelledOrders)

    const openOrders = allOrders.filter(order => !filledOrders.find(({id}) => order.id === id ) && !cancelledOrders.find(({id}) => order.id === id ))

    dispatch(exchangeSlice.actions.set({
      contract: exchange,
      exchangeEtherBalance,
      exchangeTokenBalances,
      allOrders,
      cancelledOrders,
      filledOrders,
      openOrders,
      orderCancelling: false
    }))

    return exchangeEtherBalance
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}

export const cancelOrder = (exchange, order, account, dispatch) => {
  console.log(order)
  console.log(account)
  console.log(exchange)
  exchange.methods.cancelOrder(order).send({ from: account})
  .on('transactionHash', (hash) => {
    //dispatch
    dispatch(exchangeSlice.actions.orderCancel())
  })
  .on('error', (error) => {
    console.log(error)
    window.alert('There was an Error')
  })

}
