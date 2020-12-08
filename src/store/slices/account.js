import { createSlice } from '@reduxjs/toolkit';

const account = createSlice({
  name: 'account',
  initialState: {
    address: null,
    tokens: null,
    ethBalance: null
  },
  reducers: {
    set: (state, action) => action.payload
  }
});

export const getAccount = (state) => state.account;

export default account;
