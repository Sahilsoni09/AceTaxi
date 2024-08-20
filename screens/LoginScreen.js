import { useContext, useEffect, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import { login } from '../util/auth';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import NotifcationContextProvider from '../context/NotifcationContextProvider';
import notificationContext from '../context/NotificationContext';


function LoginScreen() {
    const {expoToken} = useContext(notificationContext)

    useEffect (()=>{
        submitDriverId();
      },[expoToken])

    function submitDriverId() {
        fetch("https://mobile-notifiation-registraion.onrender.com", {
          // Replace with your actual backend URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: expoToken, userId:8 }), // Send driverId & expoPushToken to the backend
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(
              "expoToken & driver  ID sent to backend successfully:",
              data
            );
          })
          .catch((error) => {
            console.error("Error sending Driver ID to backend:", error);
            alert("Failed to send Driver ID. Please try again.");
          });
      }


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
