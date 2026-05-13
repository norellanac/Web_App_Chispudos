import { UserLayout } from '../../../../components/templates/UserLayout';
import Step1 from '../Organisms/Step1';
import Step2 from '../Organisms/Step2';
import Step3 from '../Organisms/Step3';
import Step4 from '../Organisms/Step4';
import Step5 from '../Organisms/Step5';
import Step6 from '../Organisms/Step6';
import { Box } from '@mui/material';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import {
  clearStepper,
  selectStepper,
} from '../../../../redux/slices/serviceStepperSlice';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';

export const BusinessStepper = () => {
  const { currentStep } = useAppSelector(selectStepper);

  const dispatch = useAppDispatch();

  //dispatch(clearStepper());

  const STEPS_COMPONENTS = [
    <Step1 />,
    <Step2 />,
    <Step3 />,
    <Step4 />,
    <Step5 />,
    <Step6 />,
  ];

  return (
    <UserLayout>
      <Box sx={{ minHeight: 'calc(100vh - 80px)', pb: '200px' }}>
        {STEPS_COMPONENTS[currentStep]}
      </Box>
    </UserLayout>
  );
};
