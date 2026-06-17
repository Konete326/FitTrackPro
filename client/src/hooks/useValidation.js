import { useState, useCallback } from 'react';

// Regex patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_]{3,30}$/,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  positiveNumber: /^\d+(\.\d+)?$/,
};

// Validation rules
export const validators = {
  required: (value, label) => {
    if (!value || (typeof value === 'string' && !value.trim())) return `${label} is required`;
    return null;
  },
  email: (value) => {
    if (!value) return null;
    return patterns.email.test(value) ? null : 'Enter a valid email (e.g. name@example.com)';
  },
  username: (value) => {
    if (!value) return null;
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 30) return 'Username must be under 30 characters';
    return patterns.username.test(value) ? null : 'Only letters, numbers, and underscores allowed';
  },
  password: (value) => {
    if (!value) return null;
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-z]/.test(value)) return 'Must include a lowercase letter';
    if (!/[A-Z]/.test(value)) return 'Must include an uppercase letter';
    if (!/\d/.test(value)) return 'Must include a number';
    return null;
  },
  name: (value, label = 'Name') => {
    if (!value) return null;
    if (value.length < 2) return `${label} must be at least 2 characters`;
    return patterns.name.test(value) ? null : 'Only letters, spaces, hyphens, and apostrophes';
  },
  numberRange: (value, min, max, label) => {
    if (!value && value !== 0) return null;
    const num = Number(value);
    if (isNaN(num)) return `${label} must be a number`;
    if (num < min) return `${label} must be at least ${min}`;
    if (num > max) return `${label} must be under ${max}`;
    return null;
  },
  minLength: (value, min, label) => {
    if (!value) return null;
    return value.length >= min ? null : `${label} must be at least ${min} characters`;
  },
  maxLength: (value, max, label) => {
    if (!value) return null;
    return value.length <= max ? null : `${label} must be under ${max} characters`;
  },
  match: (value, otherValue, label) => {
    if (!value) return null;
    return value === otherValue ? null : `${label} do not match`;
  },
};

// Helper texts for form fields
export const hints = {
  email: 'e.g. name@example.com',
  username: '3-30 chars, letters, numbers, underscores',
  password: 'Min 8 chars, uppercase, lowercase, number',
  name: '2-50 characters, letters and spaces',
  age: 'Between 13 and 120',
  confirmPassword: 'Must match the password above',
};

/**
 * useValidation hook
 * @param {Object} rules - { fieldName: [(value) => errorMsg | null, ...], ... }
 * @returns { errors, touched, validate, validateField, validateAll, handleChange, handleBlur, isValid, setFieldError }
 */
export function useValidation(rules = {}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const fieldRules = rules[name] || [];
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
        return error;
      }
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    return null;
  }, [rules]);

  const handleChange = useCallback((name, value) => {
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, [validateField]);

  const validateAll = useCallback((formData) => {
    const newErrors = {};
    let firstError = null;
    Object.keys(rules).forEach((name) => {
      const fieldRules = rules[name];
      for (const rule of fieldRules) {
        const error = rule(formData[name]);
        if (error) {
          newErrors[name] = error;
          if (!firstError) firstError = name;
          break;
        }
      }
    });
    setErrors(newErrors);
    // Mark all as touched
    const allTouched = {};
    Object.keys(rules).forEach((name) => { allTouched[name] = true; });
    setTouched(allTouched);
    return Object.keys(newErrors).length === 0;
  }, [rules]);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return { errors, touched, validateField, handleChange, handleBlur, validateAll, isValid, setFieldError };
}
