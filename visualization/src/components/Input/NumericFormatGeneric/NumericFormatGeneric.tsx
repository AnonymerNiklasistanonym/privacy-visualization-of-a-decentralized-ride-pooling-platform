// Package imports
import {NumericFormat, NumericFormatProps} from 'react-number-format';
import {forwardRef} from 'react';

export interface NumericFormatGenericProps {
  onChange: (event: {target: {name: string; value: string}}) => void;
  name: string;
  suffix?: string;
}

export const NumericFormatGeneric = forwardRef<
  NumericFormatProps,
  NumericFormatGenericProps
>((props, ref) => {
  const {name, onChange, ...other} = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={values => {
        onChange({
          target: {
            name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
    />
  );
});
NumericFormatGeneric.displayName = 'NumericFormatAdapter';

export default NumericFormatGeneric;
