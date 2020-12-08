import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { groupBy, minBy, maxBy } from 'lodash';

const exchange = createSlice({
  name: 'exchange',
  initialState: {
    contract: null,
    exchangeEtherBalance: 0,
    exchangeTokenBalances: 0,
    allOrders: [],
    cancelledOrders: [],
    filledOrders: [],
    openOrders: [],
    loaded: false,
    orderCancelling: false,
  },
  reducers: {
    set: (state, action) => action.payload,
    orderCancel: (state) => state.orderCancelling = true
  }
});

export const getExchange = (state) => state.exchange;

export const getFilledOrders = (state) => state.exchange.filledOrders;

export const getExchangeContract = (state) => state.exchange.contract;

export const getChartData = (state) => {
  const orders = groupBy(state.exchange.filledOrders, (o) => moment.unix(o.timestamp).startOf('hour').format())
  const hours = Object.keys(orders)
  console.log(orders)
  const graphData = hours.map(hour => {
    const group = orders[hour]
    const open = group[0]
    const high = maxBy(group, 'tokenPrice')
    const low = minBy(group, 'tokenPrice')
    const close = group[group.length - 1]
    return({
      x: new Date(hour),
      y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
    })
  })
  console.log(graphData)
  const series = [{
    data: graphData
  }]
  return series
};

export const getUserOrders = (state) => {
  const orders = state.exchange.filledOrders
  orders.filter(order => order.user)
};

export const getOpenOrders = (state) => state.exchange.openOrders;

export const getExchangeLoaded = (state) => state.exchange.loaded;

export default exchange;
