import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

interface RoleSwitcherState {
  currentMode: 'user' | 'merchant';
}

const initialState: RoleSwitcherState = {
  currentMode: 'user',
};

const roleSwitcherSlice = createSlice({
  name: 'roleSwitcher',
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.currentMode = state.currentMode === 'user' ? 'merchant' : 'user';
    },
  },
});

export const { toggleMode } = roleSwitcherSlice.actions;
export const selectMode = (state: RootState) => state.roleSwitcher.currentMode;
export default roleSwitcherSlice.reducer;
