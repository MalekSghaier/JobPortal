import React, { useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { DataGrid, gridClasses, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { allUserAction, deleteSingleUserAction } from '../../redux/actions/userAction';

const DashUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(allUserAction());
    }, []);

    const { success: deleteSuccess } = useSelector(state => state.deleteUser);
    const { users } = useSelector((state) => state.allUsers);
    let data = [];
    data = (users !== undefined && users.length > 0) ? users : []



    // delete a job by id
    const deleteUserById = (e, id) => {
        if (window.confirm(`You really want to delete product ID: "${id}" ?`)) {
            dispatch(deleteSingleUserAction(id));
            if (deleteSuccess && deleteSuccess === true) {
                dispatch(allUserAction())
                navigate('/admin/users');

            }
        }
    }
    

    const columns = [
        {
            field: '_id',
            headerName: 'User ID',
            width: 150,
            editable: false,
        },
        {
            field: 'email',
            headerName: 'E-mail',
            width: 150,
        },
        {
            field: 'role',
            headerName: 'User status',
            width: 150,
            renderCell: (params) =>
                params.row.role === 1 ? 'Admin' : 'Regular user',
        },
        {
            field: 'createdAt',
            headerName: 'Creation date',
            width: 150,
            renderCell: (params) =>
                moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '170px',
                    }}
                >
                    {/* Bouton Edit */}
                    <Button variant="contained">
                        <Link
                            style={{ color: 'white', textDecoration: 'none' }}
                            to={`/admin/edit/user/${params.row._id}`}
                        >
                            Edit
                        </Link>
                    </Button>
                    < Button onClick={(e) => deleteUserById(e, params.row._id)} variant="contained" color="error">Delete</ Button>

                </Box>
            ),
        },
    ];

    return (
        <>
            <Box>
                <Typography variant="h4" sx={{ color: 'white', pb: 3 }}>
                    All users
                </Typography>
                <Box sx={{ pb: 2, display: 'flex', justifyContent: 'right' }}>
                    <Button
                        component={Link}
                        to="/CreateUser"
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                    >
                        Create user
                    </Button>
                </Box>
                <Paper sx={{ bgcolor: 'secondary.midNightBlue' }}>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            sx={{
                                '& .MuiTablePagination-displayedRows': {
                                    color: 'white',
                                },
                                color: 'black',
                                [`& .${gridClasses.row}`]: {
                                    bgcolor: (theme) =>
                                        theme.palette.secondary.main,
                                },
                                button: {
                                    color: '#ffffff',
                                },
                            }}
                            getRowId={(row) => row._id} // Assure que _id est utilisé comme identifiant unique
                            rows={data}
                            columns={columns}
                            pageSize={3}
                            rowsPerPageOptions={[3]}
                            checkboxSelection
                            slots={{ toolbar: GridToolbar }}
                        />
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default DashUsers;
