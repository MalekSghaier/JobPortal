import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userSignUpAction } from '../../redux/actions/userAction'; // Assurez-vous que cette action existe

// Schéma de validation
const validationSchema = yup.object({
    firstName: yup
        .string('Enter first name')
        .required('First name is required')
        .max(32, 'First name must not exceed 32 characters'),
    lastName: yup
        .string('Enter last name')
        .required('Last name is required')
        .max(32, 'Last name must not exceed 32 characters'),
    email: yup
        .string('Enter email')
        .required('Email is required')
        .email('Enter a valid email'),
    password: yup
        .string('Enter password')
        .required('Password is required')
        .min(6, 'Password should be at least 6 characters long'),
});

const DashCreateUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, actions) => {
            // Appeler l'action Redux avec une fonction de rappel pour redirection
            dispatch(userSignUpAction(values, () => {
                navigate('/admin/users'); // Redirige vers la liste des utilisateurs
            }));
            actions.resetForm();
        },
    });

    return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 4 }}>
            <Box onSubmit={formik.handleSubmit} component="form" className="form_style border-style">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h5" component="h2" sx={{ pb: 3 }}>
                        Create a User
                    </Typography>

                    <TextField
                        sx={{ mb: 3 }}
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                    />

                    <TextField
                        sx={{ mb: 3 }}
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                    />

                    <TextField
                        sx={{ mb: 3 }}
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                        sx={{ mb: 3 }}
                        fullWidth
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                    <Button fullWidth variant="contained" type="submit">
                        Create User
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default DashCreateUser;
