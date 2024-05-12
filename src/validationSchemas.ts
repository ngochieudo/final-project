import * as Yup from 'yup';

export const registrationSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(1, 'Username must be at least 1 characters')
        .required('First name is required'),
    lastName: Yup.string()
        .min(1, 'Username must be at least 1 characters')
        .required('Last name is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string().required('Password is required'),
});