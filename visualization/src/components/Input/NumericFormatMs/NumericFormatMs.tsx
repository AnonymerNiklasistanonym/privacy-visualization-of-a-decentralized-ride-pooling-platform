// Package imports
import {NumericFormat, NumericFormatProps} from 'react-number-format';
import {forwardRef} from 'react';

export interface NumericFormatMsProps {
  onChange: (event: {target: {name: string; value: string}}) => void;
  name: string;
}

export const NumericFormatMs = forwardRef<
  NumericFormatProps,
  NumericFormatMsProps
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
      suffix="ms"
    />
  );
});
NumericFormatMs.displayName = 'NumericFormatAdapterMs';

export default NumericFormatMs;
