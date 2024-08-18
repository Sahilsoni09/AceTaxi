import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import { login } from '../util/auth';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';


function LoginScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const authCtx = useContext(AuthContext);

    async function loginHandler({username,password}) {
        console.log(username, password);
        setIsAuthenticating(true);
        try{
            const token = await login(username, password);
            authCtx.authenticate(token);
        }catch(error){
            Alert.alert(
                'Authentication failed',
                'Could not log you in. Please check your credentials and try again later!'
            )
            setIsAuthenticating(false);
        }
        // setIsAuthenticating(false);
    }
    if(isAuthenticating) {
        return <LoadingOverlay message= "Logging you in.."/>
    }

  return <AuthContent isLogin onAuthenticate={loginHandler}/>;
}

export default LoginScreen;
