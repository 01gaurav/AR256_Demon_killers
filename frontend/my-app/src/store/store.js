import { createContext } from 'react';





const ltoken = (localStorage.getItem('FBIdToken') !== null)?true:false ;
const llang = (localStorage.getItem('lang')!== null ? true :false );
var l;
if(!llang){
    localStorage.setItem('lang', "English");
    l = 'English';
}else{
    var x = localStorage.lang;
    if(x === 'Hindi'){
        l = 'Hindi';
    }else{
        l = 'English';
    }
}


const Context = createContext({
    user: null ,
    isAuth: (ltoken)?true:false,
    token: localStorage.FBIdToken,
    lang: l
})

export default Context;