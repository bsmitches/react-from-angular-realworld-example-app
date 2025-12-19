import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

interface BaseFormFieldProps {
  error?: string;
  large?: boolean;
}

interface InputFormFieldProps extends BaseFormFieldProps, InputProps {
  as?: 'input';
}

interface TextareaFormFieldProps extends BaseFormFieldProps, TextareaProps {
  as: 'textarea';
}

type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps;

export function FormField(props: FormFieldProps) {
  const { error, large = true, as = 'input', className = '', ...rest } = props;

  const sizeClass = large ? 'form-control-lg' : '';
  const combinedClassName = `form-control ${sizeClass} ${className}`.trim();

  return (
    <fieldset className="form-group">
      {as === 'textarea' ? (
        <textarea
          className={combinedClassName}
          {...(rest as TextareaProps)}
        />
      ) : (
        <input
          className={combinedClassName}
          {...(rest as InputProps)}
        />
      )}
      {error && <span className="error-message">{error}</span>}
    </fieldset>
  );
}

export default FormField;
