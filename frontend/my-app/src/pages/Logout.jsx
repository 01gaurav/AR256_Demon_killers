import React, { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom';

import Store from '../store/store';

const Logout = () => {
    const{state,dispatch} = useContext(Store);
    useEffect(() => {
        if(state.isAuth){
            dispatch({
                type : 'LOGOUT'
            });
        }    
    });
    return <Redirect to='/login' />;
}

export default Logout; 