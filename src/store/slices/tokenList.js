import { createSlice } from '@reduxjs/toolkit';

const tokenList = createSlice({
  name: 'tokenList',
  initialState: [],
  reducers: {
    set: (state, action) => action.payload,
  }
});

export const getTokenList = (state) => state.tokenList;

export default tokenList;
