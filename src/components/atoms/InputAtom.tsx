import { InputAdornment, TextField, TextFieldProps, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import TextAtom from './TextAtom';
import { Field } from 'formik';

interface SelectOption {
  value: string | number;
  label: string;
}

interface InputAtomProps extends Omit<TextFieldProps, 'variant'> {
  variant: 'outlined' | 'underlined' | 'rounded';
  label: string;
  placeholder: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errorMsg?: string;
  helperText?: string | undefined
  name: string;
  type?: string;
  // Text area specific props
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  // Select-specific props
  isSelect?: boolean;
  options?: SelectOption[];
  multiple?: boolean;
  renderValue?: (selected: unknown) => React.ReactNode;
  showCheckbox?: boolean;
}

const InputAtom: React.FC<InputAtomProps> = ({
  variant,
  label,
  placeholder,
  leftIcon,
  rightIcon,
  errorMsg,
  helperText,
  type = 'text',
  name,
  // Multiline props
  multiline = false,
  rows = 4,
  maxRows,
  // Select props
  isSelect = false,
  options = [],
  multiple = false,
  renderValue,
  showCheckbox = true,
  ...props
}) => {
  const theme = useTheme();

  const getInputStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          borderRadius: '8px',
          width: '100%',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.dark,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.light,
            },
            ...(errorMsg && {
              '& fieldset': {
                borderColor: theme.palette.error.main,
              },
            }),
            ...(multiline && {
              padding: '8px 14px',
            }),
          },
        };
      case 'underlined':
        return {
          width: '100%',
          '& .MuiInput-underline:before': {
            borderBottomColor: theme.palette.secondary.main,
          },
          '& .MuiInput-underline:hover:before': {
            borderBottomColor: theme.palette.secondary.dark,
          },
          '& .MuiInput-underline.Mui-focused:before': {
            borderBottomColor: theme.palette.secondary.light,
          },
          ...(errorMsg && {
            '&:before': {
              borderBottomColor: theme.palette.error.main,
            },
          }),
        };
      case 'rounded':
        return {
          borderRadius: '100px',
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: multiline ? '16px' : '100px', // Adjust border radius for multiline
            '& fieldset': {
              borderColor: theme.palette.tertiary.main,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.tertiary.dark,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.tertiary.light,
            },
            ...(errorMsg && {
              '& fieldset': {
                borderColor: theme.palette.error.main,
              },
            }),
          },
        };
      default:
        return {};
    }
  };

  // Default renderValue function for multiple select
  const defaultRenderValue = (selected: unknown) => {
    if (!Array.isArray(selected)) return '';

    return selected.map(value => {
      const option = options.find(opt => opt.value === value);
      return option?.label || value;
    }).join(', ');
  };

  return (
    <Field name={name}>
      {({ field, form: { isSubmitting, setFieldValue } }) => (
        isSelect ? (
          <TextField
            select
            {...field}
            label={label}
            placeholder={placeholder}
            error={!!errorMsg}
            disabled={isSubmitting}
            variant={variant === 'underlined' ? 'standard' : 'outlined'}
            helperText={
              errorMsg ? (
                <TextAtom variant="body" size="small">
                  {errorMsg}
                </TextAtom>
              ) : helperText ? (
                <TextAtom variant="body" size="small">
                  {helperText}
                </TextAtom>
              ) : undefined
            }
            SelectProps={{
              multiple,
              renderValue: renderValue || (multiple ? defaultRenderValue : undefined),
              displayEmpty: false,
              startAdornment: leftIcon ? (
                <InputAdornment position="start">{leftIcon}</InputAdornment>
              ) : undefined,
              endAdornment: rightIcon ? (
                <InputAdornment position="end">{rightIcon}</InputAdornment>
              ) : undefined,
            }}
            {...props}
            sx={[
              getInputStyles(),
              // Add additional padding for outlined and rounded variants
              variant !== 'underlined' && {
                '& .MuiOutlinedInput-root': {
                  pt: 0.5, // Add some padding to the top
                }
              },
              ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
            ]}
            onChange={e => {
              // Handle Formik field change
              setFieldValue(name, e.target.value);
            }}
          >
            {placeholder && (
              <MenuItem value="" disabled>
                {placeholder}
              </MenuItem>
            )}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {multiple && showCheckbox && (
                  <Checkbox checked={field.value?.includes(option.value)} />
                )}
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            {...field}
            type={type}
            variant={variant === 'underlined' ? 'standard' : 'outlined'}
            label={label}
            placeholder={placeholder}
            error={!!errorMsg}
            disabled={isSubmitting}
            multiline={multiline}
            rows={rows}
            maxRows={maxRows}
            helperText={
              errorMsg ? (
                <TextAtom variant="body" size="small">
                  {errorMsg}
                </TextAtom>
              ) : helperText ? (
                <TextAtom variant="body" size="small">
                  {helperText}
                </TextAtom>
              ) : undefined
            }
            InputProps={{
              startAdornment: leftIcon ? (
                <InputAdornment position="start">{leftIcon}</InputAdornment>
              ) : undefined,
              endAdornment: rightIcon ? (
                <InputAdornment position="end">{rightIcon}</InputAdornment>
              ) : undefined,
            }}
            sx={[
              getInputStyles(),
              ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
            ]}
          />
        )
      )}
    </Field>
  );
};

export default InputAtom;