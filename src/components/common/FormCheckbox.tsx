import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  CheckboxProps,
} from '@mui/material';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import clsx from 'clsx';

interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  className?: string; // For Tailwind wrapper classes
  disabled?: boolean;
  muiProps?: Omit<CheckboxProps, 'name' | 'control'>;
}

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  className = '',
  disabled = false,
  muiProps = {},
}: FormCheckboxProps<TFieldValues, TName>) {
  return (
    <div className={clsx('w-full', className)}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  disabled={disabled}
                  size="small"
                  {...muiProps}
                />
              }
              label={
                <span className="text-sm text-gray-700">{label}</span>
              }
            />
            {error && (
              <FormHelperText error className="mt-0">
                {error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </div>
  );
}
