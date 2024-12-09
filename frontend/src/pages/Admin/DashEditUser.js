import React, { useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { userLoadSingleAction ,editSingleUserAction  } from '../../redux/actions/userAction';
import { EDIT_USER_RESET } from '../../redux/constants/userConstant';

// Validation schema for the user form
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
        .min(6, 'Password should be at least 6 characters long'),
});

const DashEditUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    // Fetch user data
    useEffect(() => {
        console.log("ID from URL:", id); // Vérifiez que l'ID est correctement récupéré
        if (id) {
            dispatch(userLoadSingleAction(id)); // Fetch user data by ID
        }
    }, [id, dispatch]);

    // Get user data from the Redux store
    const { user, loading } = useSelector((state) => state.user);
    console.log(user)
    const { success } = useSelector((state) => state.updateUser);

    const formik = useFormik({
        initialValues: {
            _id: user?._id,
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            password: '', // Optionnel pour mise à jour
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values, actions) => {
            const userData = { ...values, id };  // Ajoutez l'ID dans les données
            dispatch(editSingleUserAction(values)); // Envoi des données de l'utilisateur
            actions.resetForm();
            navigate('/admin/users');
        },
    });
    

    //redirect after successfull update
    useEffect(() => {
        if (success && success === true) {
            setTimeout(() => {
                dispatch({ type: EDIT_USER_RESET })
                navigate('/admin/users');
            }, 800)
        }
    }, [success && success]);


    return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 4 }}>
            <Box onSubmit={formik.handleSubmit} component="form" className="form_style border-style">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h5" component="h2" sx={{ pb: 3 }}>
                        Edit User
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
                        Edit User
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default DashEditUser;
