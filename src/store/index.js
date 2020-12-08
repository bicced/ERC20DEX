import { configureStore } from '@reduxjs/toolkit';
import web3Slice from './slices/web3';
import accountSlice from './slices/account';
import tokenListSlice from './slices/tokenList';
import tradePairSlice from './slices/tradePair';
import exchangeSlice from './slices/exchange';

const store = configureStore({
  reducer: {
    web3: web3Slice.reducer,
    account: accountSlice.reducer,
    tradePair: tradePairSlice.reducer,
    tokenList: tokenListSlice.reducer,
    exchange: exchangeSlice.reducer
  }
})

export default store;
