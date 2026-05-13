import { useCallback } from 'react';

type DateValidationConfig = {
  disabledDates?: Date[]; 
  disableWeekends?: boolean; 
  enabledRange?: { start: Date; end: Date }; 
  customValidation?: (date: Date) => boolean; 
};

export function useDateValidation(config: DateValidationConfig) {
  const { disabledDates = [], disableWeekends = false, enabledRange, customValidation } = config;

  const isDateEnabled = useCallback(
    (date: Date): boolean => {
      if (disabledDates.some(disabled => disabled.toDateString() === date.toDateString())) {
        return false;
      }

      if (disableWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
        return false;
      }

      if (enabledRange) {
        if (date < enabledRange.start || date > enabledRange.end) {
          return false;
        }
      }

      if (customValidation && !customValidation(date)) {
        return false;
      }

      return true;
    },
    [disabledDates, disableWeekends, enabledRange, customValidation]
  );

  const getDisabledDatesInRange = useCallback(
    (startDate: Date, endDate: Date): Date[] => {
      const disabledInRange: Date[] = [];

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        if (!isDateEnabled(currentDate)) {
          disabledInRange.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return disabledInRange;
    },
    [isDateEnabled]
  );

  return { isDateEnabled, getDisabledDatesInRange };
}
