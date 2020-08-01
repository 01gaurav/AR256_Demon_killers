export default function rootReducer(state, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case 'LOGIN':
        case 'ONBOARD':
            localStorage.setItem('FBIdToken',  `${payload}`);

            

            return {
                ...state,
                token: payload,
                    isAuth: true
                    
            }
        case 'LOGOUT':
            localStorage.removeItem('FBIdToken')
            return {
                user: null,
                token: null,
                isAuth: false
                        
            }
        case 'UPDATE' : 
            return{
                ...state,
                user: payload
            }
        
        case 'LANG' : 
            return{
                ...state,
                lang: payload
            }

        default:
            return state
    }
}