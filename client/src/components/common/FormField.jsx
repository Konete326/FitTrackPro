import React from 'react';
import { Controller } from 'react-hook-form';

function FormField({ control, name, rules, label, helperText, children, className = '' }) {
  return (
    <div className={className}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            {typeof children === 'function'
              ? children({ ...field, error: error?.message, label, helperText })
              : React.cloneElement(children, { ...field, error: error?.message, label, helperText })}
          </>
        )}
      />
    </div>
  );
}

export default FormField;
