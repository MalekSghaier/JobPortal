import { Card, CardContent, Stack, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { useEffect } from 'react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Footer from '../component/Footer';
import LoadingBox from '../component/LoadingBox';
import Navbar from '../component/Navbar';
import { jobLoadSingleAction } from '../redux/actions/jobAction';
import Button from '@mui/material/Button';
import { sendJobApplicationEmailAction, userProfileAction } from '../redux/actions/userAction'; // Regroupement des actions
import { useTheme } from '@emotion/react';

const SingleJob = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const { loading, singleJob } = useSelector(state => state.singleJob);
    const { userInfo } = useSelector(state => state.signIn); // Vérification de userInfo dans le store
    const { id } = useParams();
    const { loading: sendingEmail } = useSelector(state => state.userJobApplication);

    console.log("user exemple ",userInfo)

    // Charger les informations du job
    useEffect(() => {
        dispatch(jobLoadSingleAction(id));
    }, [id, dispatch]);

    // Charger les informations utilisateur si userInfo est manquant
    useEffect(() => {
        if (!userInfo) {
            dispatch(userProfileAction()); // Assurez-vous que cette action récupère les informations utilisateur
        }
    }, [dispatch, userInfo]);

    // Fonction pour postuler à un emploi
    const applyForAJob = () => {
        // Vérification si les informations du job sont disponibles
        if (!singleJob) {
            console.error("singleJob n'est pas défini.");
            toast.error('Erreur : aucune information sur le job.');
            return;
        }
    
        // Vérification si l'utilisateur est connecté et possède un email
        if (!userInfo) {
            console.error("userInfo n'est pas défini.");
            toast.error('Erreur : utilisateur non connecté');
            return;
        }
    
        // Log de l'email pour vérifier sa disponibilité
        console.log("Email de l'utilisateur : ", userInfo.user?.email);
    
        if (!userInfo.user?.email) {
            console.error("l'email est manquant.");
            toast.error('Erreur : email manquant.');
            return;
        }
    
        // Envoyer la demande d'application au job
        try {
            dispatch(sendJobApplicationEmailAction(singleJob.title, userInfo.user.email));
            toast.success('Votre candidature a été envoyée avec succès.');
        } catch (error) {
            console.error("Erreur lors de la candidature :", error);
            toast.error("Erreur lors de l'envoi de votre candidature.");
        }
    };
    

    return (
        <Box sx={{ bgcolor: "#fafafa" }}>
            <Navbar />
            <Box sx={{ height: 'calc(100vh - 140px)' }}>
                <Container sx={{ pt: '30px' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                        <Box sx={{ flex: 4, p: 2 }}>
                            {loading ? (
                                <LoadingBox />
                            ) : (
                                <Card sx={{ bgcolor: palette.primary.white }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h3">
                                            {singleJob?.title || "Aucun titre disponible"}
                                        </Typography>
                                        <Typography variant="body2">
                                            <Box component="span" sx={{ fontWeight: 700 }}>Salaire</Box>: ${singleJob?.salary || "Non spécifié"}
                                        </Typography>
                                        <Typography variant="body2">
                                            <Box component="span" sx={{ fontWeight: 700 }}>Catégorie</Box>: {singleJob?.jobType?.jobTypeName || "Non spécifié"}
                                        </Typography>
                                        <Typography variant="body2">
                                            <Box component="span" sx={{ fontWeight: 700 }}>Lieu</Box>: {singleJob?.location || "Non spécifié"}
                                        </Typography>
                                        <Typography variant="body2" sx={{ pt: 2 }}>
                                            {singleJob?.description || "Pas de description disponible."}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Box>
                        <Box sx={{ flex: 1, p: 2 }}>
                            <Card sx={{ p: 2, bgcolor: palette.primary.white }}>
                            <Button
                              onClick={applyForAJob}
                               sx={{ fontSize: "13px" }}
                               variant="contained"
                                disabled={sendingEmail}
                              >
                                 {sendingEmail ? "Envoi en cours..." : "Postuler à ce Job"}
                           </Button>
                           <Box sx={{ flex: 1, p: 2 }}>
    
</Box>

                            </Card>
                        </Box>
                    </Stack>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default SingleJob;