import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { userDetailsReducer } from './reducers/userReducer';

import {
    deleteJobReducer,
    loadJobReducer,
    loadJobSingleReducer,
    registerAjobReducer,
    updateJobReducer,
} from './reducers/jobReducer';

import {
    createJobTypeReducer,
    loadJobTypeReducer
} from './reducers/jobTypeReducer';

import {
    allUserReducer,
    userApplyJobReducer,
    userReducerLogout,
    userReducerProfile,
    userReducerSignIn,
    userReducerSignUp,
    loadUserSingleReducer,
    updateUserReducer,
    deleteUserReducer
} from './reducers/userReducer';

import { modeReducer } from './reducers/themeModeReducer';

//combine reducers
const reducer = combineReducers({
    loadJobs: loadJobReducer,
    jobTypeAll: loadJobTypeReducer,
    signIn: userReducerSignIn,
    logOut: userReducerLogout,
    userProfile: userReducerProfile,
    singleJob: loadJobSingleReducer,
    userJobApplication: userApplyJobReducer,
    allUsers: allUserReducer,
    signUp: userReducerSignUp,
    mode: modeReducer,
    registerJob: registerAjobReducer,
    deleteJob: deleteJobReducer,
    deleteUser:deleteUserReducer,
    createJobType: createJobTypeReducer,
    updateJob: updateJobReducer,
    updateUser:updateUserReducer,
    userDetails: userDetailsReducer,
    user: loadUserSingleReducer,

});


//initial state
let initialState = {
    signIn: {
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    },
    mode: {
        mode: "light"
    },
    singleJob: {}, // État initial ajouté pour éviter l'erreur

};
const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store;