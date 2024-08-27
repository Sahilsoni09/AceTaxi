import { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
export const AuthContext = createContext({
    token: '',
    isAuthenticated: false,
    authenticate: (token)=>{},
    logout: ()=>{},  
})

function AuthContextProvider({children}){
    const [authToken,setAuthToken] = useState(); // we get the auth token only when we login successfully
    
    const tokenRef = useRef();


    function authenticate(token){
        setAuthToken(token);
        tokenRef.current = token; 
        AsyncStorage.setItem('token', token);
    }
    function logout(){
        setAuthToken((token)=>{
            console.log("token to null", token);
            return null;  
        });
        tokenRef.current = null;  
        AsyncStorage.removeItem('token');
        console.log("logout called",authToken);
    }
    const value= {
        token: authToken,
        isAuthenticated: !!authToken,
        authenticate: authenticate,
        logout: logout,
        tokenRef,
        
    }

    return <AuthContext.Provider value ={value}>
        {children}
    </AuthContext.Provider>
}

export default AuthContextProvider;