import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

type InputProps = TextFieldProps & {
  label: string;
  name: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({ label, name, value, onChange, ...props }) => {
  return <TextField 
    label={label} 
    name={name} 
    value={value}
    onChange={onChange} 
    fullWidth 
    InputLabelProps={{
      shrink: true
    }}
  {...props} 
  />;
};

export default Input;
