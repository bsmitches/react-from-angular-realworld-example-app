import { Errors } from '../types/errors.types';

interface ListErrorsProps {
  errors: Errors | null;
}

export function ListErrors({ errors }: ListErrorsProps) {
  if (!errors || !errors.errors) {
    return null;
  }

  const errorList = Object.keys(errors.errors).flatMap((key) =>
    errors.errors[key].map((message) => `${key} ${message}`)
  );

  if (errorList.length === 0) {
    return null;
  }

  return (
    <ul className="error-messages">
      {errorList.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );
}

export default ListErrors;
