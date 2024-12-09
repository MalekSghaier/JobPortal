import axios from 'axios';
import { toast } from "react-toastify";
import {
    ALL_USER_LOAD_FAIL,
    ALL_USER_LOAD_REQUEST,
    ALL_USER_LOAD_SUCCESS,
    DELETE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    EDIT_USER_FAIL,
    EDIT_USER_REQUEST,
    EDIT_USER_SUCCESS,
    USER_APPLY_JOB_FAIL,
    USER_APPLY_JOB_REQUEST,
    USER_APPLY_JOB_SUCCESS,
    USER_LOAD_FAIL,
    USER_LOAD_REQUEST,
    USER_LOAD_SINGLE_FAIL,
    USER_LOAD_SINGLE_REQUEST,
    USER_LOAD_SINGLE_SUCCESS,
    USER_LOAD_SUCCESS,
    USER_LOGOUT_FAIL,
    USER_LOGOUT_REQUEST,
    USER_LOGOUT_SUCCESS,
    USER_SIGNIN_FAIL,
    USER_SIGNIN_REQUEST,
    USER_SIGNIN_SUCCESS,
    USER_SIGNUP_FAIL,
    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
} from '../constants/userConstant';



export const userSignInAction = (user) => async (dispatch) => {
    dispatch({ type: USER_SIGNIN_REQUEST });
    try {
        const { data } = await axios.post("/api/signin", user);
        // Enregistrement des données de l'utilisateur dans le localStorage
        localStorage.setItem('userInfo', JSON.stringify(data));
        console.log('userinfooo', data);
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: data
        });
        toast.success("Login Successfully!");
    } catch (error) {
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload: error.response.data.error
        });
        toast.error(error.response.data.error);
    }
}


// user sign up action
export const userSignUpAction = (user, callback) => async (dispatch) => {
    dispatch({ type: USER_SIGNUP_REQUEST });
    try {
        const { data } = await axios.post("/api/signup", user);

        dispatch({
            type: USER_SIGNUP_SUCCESS,
            payload: data,
        });

        toast.success("Register Successfully!");

        // Exécuter le callback (par exemple, redirection)
        if (callback) {
            callback();
        }
    } catch (error) {
        dispatch({
            type: USER_SIGNUP_FAIL,
            payload: error.response?.data?.error || "Something went wrong",
        });
        toast.error(error.response?.data?.error || "Registration failed");
    }
};

//log out action
export const userLogoutAction = () => async (dispatch) => {
    dispatch({ type: USER_LOGOUT_REQUEST });
    try {
        localStorage.removeItem('userInfo');
        const { data } = await axios.get("/api/logout");
        dispatch({
            type: USER_LOGOUT_SUCCESS,
            payload: data
        });
        toast.success("Log out successfully!");
    } catch (error) {
        dispatch({
            type: USER_LOGOUT_FAIL,
            payload: error.response.data.error
        });
        toast.error(error.response.data.error);
    }
}


//user profile action
export const userProfileAction = () => async (dispatch) => {
    dispatch({ type: USER_LOAD_REQUEST });
    try {
        const { data } = await axios.get("/api/me");
        dispatch({
            type: USER_LOAD_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_LOAD_FAIL,
            payload: error.response.data.error
        });
    }
}


//all user action
export const allUserAction = () => async (dispatch) => {
    dispatch({ type: ALL_USER_LOAD_REQUEST });
    try {
        const { data } = await axios.get("/api/allusers");
        dispatch({
            type: ALL_USER_LOAD_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: ALL_USER_LOAD_FAIL,
            payload: error.response.data.error
        });
    }
}


//delete single job action
export const deleteSingleUserAction = (id) => async (dispatch) => {
    dispatch({ type: DELETE_USER_REQUEST });
    try {
        const { data } = await axios.delete(`/api/admin/user/delete/${id}`);
        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data
        });
        toast.success("Job deleted successfully");
    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.error
        });
        toast.error(error.response.data.error);
    }
}


// Action pour envoyer une candidature à un poste
export const sendJobApplicationEmailAction = (jobTitle, userEmail) => async (dispatch) => {
    try {
        dispatch({ type: USER_APPLY_JOB_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            '/api/user/sendemail',
            { jobTitle, userEmail },
            config
        );

        dispatch({
            type: USER_APPLY_JOB_SUCCESS,
            payload: data,
        });

        toast.success("Votre candidature a été envoyée avec succès.");
    } catch (error) {
        dispatch({
            type: USER_APPLY_JOB_FAIL,
            payload: error.response?.data?.message || "Erreur lors de l'envoi de la candidature.",
        });

        toast.error(error.response?.data?.message || "Erreur lors de l'envoi de la candidature.");
    }
};


//user job apply action
export const userApplyJobAction = (job) => async (dispatch) => {
    dispatch({ type: USER_APPLY_JOB_REQUEST });
    try {
        const { data } = await axios.post("/api/user/jobhistory", job);

        dispatch({
            type: USER_APPLY_JOB_SUCCESS,
            payload: data
        });
        toast.success("Apply Successfully for this Job!");
    } catch (error) {
        dispatch({
            type: USER_APPLY_JOB_FAIL,
            payload: error.response.data.error
        });
        toast.error(error.response.data.error);
    }
}


// single user action
export const userLoadSingleAction = (id) => async (dispatch) => {
    dispatch({ type: USER_LOAD_SINGLE_REQUEST });
    try {
        const { data } = await axios.get(`/api/user/${id}`);
        dispatch({
            type: USER_LOAD_SINGLE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: USER_LOAD_SINGLE_FAIL,
            payload: error.response.data.error
        });
    }
}

export const editSingleUserAction = (userData) => async (dispatch) => {
    dispatch({ type: EDIT_USER_REQUEST });
    try {
        const { data } = await axios.put(`/api/user/edit/${userData._id}`, userData); // Utilisation de l'ID dans l'URL
        dispatch({
            type: EDIT_USER_SUCCESS,
            payload: data.user
        });
        toast.success("User updated successfully");
    } catch (error) {
        dispatch({
            type: EDIT_USER_FAIL,
            payload: error.response.data.error
        });
        toast.error(error.response.data.error);
    }
};


