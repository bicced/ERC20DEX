import { createSlice } from '@reduxjs/toolkit';

const tradePair = createSlice({
  name: 'tradePair',
  initialState: {
    chainId: 1,
    address: '0x7F11457A8A7083B1404E12e1e6149919cd97c766',
    name: 'testCoin',
    symbol: 'TEST',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/193/thumb/XlQmXoU.png?1595304945'
  },
  reducers: {
    set: (state, action) => action.payload,
  }
});

export const getTradePair = (state) => state.tradePair;

export default tradePair;
