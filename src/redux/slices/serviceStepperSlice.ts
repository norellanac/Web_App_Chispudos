import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { ProductService } from '../../types/api/modelTypes';



interface StepperState { 
  service?: ProductService
    currentStep: number;
  }

  const initialState: StepperState = {
    service: {} as ProductService,
    currentStep: 0,
  };

  const serviceStepperSlice = createSlice({
    name: 'serviceStepper',
    initialState,
    reducers: {
      setCurrentStep      (state, action: PayloadAction<number>) {
        state.currentStep = action.payload;
      },
      setServiceState      (state, action: PayloadAction<ProductService>) {
        state.service = action.payload;
      },
      clearStepper(state) {
        state.currentStep = initialState.currentStep;
        state.service = initialState.service;
      }
    },
  });
  
  export const { setCurrentStep, setServiceState, clearStepper } = serviceStepperSlice.actions;
  export const selectStepper = (state: RootState) => state.serviceStepper;

  export default serviceStepperSlice.reducer;

