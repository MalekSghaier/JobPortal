import { Typography ,Button} from '@mui/material'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom';
import React from 'react'
import { useSelector } from 'react-redux'
import CardElement from '../../component/CardElement'


const UserJobsHistory = () => {
    const { user } = useSelector(state => state.userProfile);


    return (
        <>
            <Box>
                <Typography variant="h4" sx={{ color: "#fafafa" }}> Jobs History</Typography>
                <Button variant="contained">
                        <Link
                            style={{ color: 'white', textDecoration: 'none' }}
                            to={`/`}
                        >
                            Back to Jobs
                        </Link>
                </Button>
                <Box>
                    {
                        user && user.jobsHistory.map((history, i) => (
                            <CardElement
                                key={i}
                                id={history._id}
                                jobTitle={history.title}
                                description={history.description}
                                category=''
                                location={history.location}
                            />
                        ))
                    }
                </Box>
            </Box>
        </>
    )
}

export default UserJobsHistory