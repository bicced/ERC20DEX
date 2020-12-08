import { createSlice } from '@reduxjs/toolkit';

const web3 = createSlice({
  name: 'web3',
  initialState: false,
  reducers: {
    set: (state) => true,
  }
});

export const getWeb3Loaded = (state) => state.web3;

export default web3;
