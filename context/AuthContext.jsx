import { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
export const AuthContext = createContext({
    token: '',
    isAuthenticated: false,
    authenticate: (token)=>{},
    logout: ()=>{},  
})

function AuthContextProvider({children}){
    
    const [authData, setAuthData] = useState(null)
    const tokenRef = useRef();

    function authenticate(data){
       
        setAuthData(data);
        console.log("authData", data);  
        tokenRef.current = data.token,
        AsyncStorage.setItem('authData', JSON.stringify(data));
    }

    function logout(){
        setAuthData(null);
        tokenRef.current = null;  
        AsyncStorage.removeItem('authData');
        
    }
    const value= {
        token: authData?.token,
        isAuthenticated: !!authData?.token,
        authenticate: authenticate,
        logout: logout,
        tokenRef,
        authData,
        
    }

    return <AuthContext.Provider value ={value}>
        {children}
    </AuthContext.Provider>
}

export default AuthContextProvider;