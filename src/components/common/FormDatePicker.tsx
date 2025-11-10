import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import clsx from 'clsx';

interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  className?: string; // For Tailwind wrapper classes
  disabled?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disablePast?: boolean;
  disableFuture?: boolean;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  className = '',
  disabled = false,
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
}: FormDatePickerProps<TFieldValues, TName>) {
  return (
    <div className={clsx('w-full', className)}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label={label}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => {
                field.onChange(date ? date.format('YYYY-MM-DD') : '');
              }}
              disabled={disabled}
              minDate={minDate}
              maxDate={maxDate}
              disablePast={disablePast}
              disableFuture={disableFuture}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: disabled ? '#f3f4f6' : 'white',
                    },
                  },
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
}
