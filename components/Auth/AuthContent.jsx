import { useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';

import FlatButton from '../ui/FlatButton'; 
import AuthForm from './AuthForm'; 

import { useNavigation } from '@react-navigation/native'; 
import { Colors } from '../../constants/Styles';

function AuthContent({ isLogin, onAuthenticate }) {
    const navigation = useNavigation(); 
    const [credentialsInvalid, setCredentialsInvalid] = useState({
        // State to track validation errors for each input field
        username: false,
        email: false,
        password: false,
        confirmEmail: false,
        confirmPassword: false,
    });

    // Handler to switch between login and signup screens
    function switchAuthModeHandler() {
        navigation.replace(isLogin ? "Signup" : "Login"); // Replace the current screen in the stack
    }

    // Form submission handler
    function submitHandler(credentials) {
        // Destructure user inputs from the form
        let { username, email, confirmEmail, password, confirmPassword } = credentials;

        // Trim leading/trailing whitespace from inputs
        username = username.trim();
        email = email.trim();
        password = password.trim();

        // Input validation checks
        const usernameIsValid = username.length > 3; // Username must be longer than 3 characters
        const emailIsValid = isLogin || email.includes('@'); // Email should contain '@' in signup mode
        const passwordIsValid = password.length > 6; // Password should be longer than 6 characters
        const emailsAreEqual = email === confirmEmail; // Confirm email should match the email input
        const passwordsAreEqual = password === confirmPassword; // Confirm password should match the password input

        // If validation fails, show an alert and update the invalid state
        if (
            !usernameIsValid ||
            !passwordIsValid ||
            (!isLogin && (!emailIsValid || !emailsAreEqual || !passwordsAreEqual))
        ) {
            Alert.alert('Invalid input', 'Please check your entered credentials.');
            setCredentialsInvalid({
                username: !usernameIsValid,
                email: !emailIsValid,
                confirmEmail: !emailsAreEqual,
                password: !passwordIsValid,
                confirmPassword: !passwordsAreEqual,
            });
            return; // Stop further execution if inputs are invalid
        }

        // If valid, trigger authentication (login/signup) using the passed callback
        onAuthenticate({ username, email, password });
    }

    return (
        <View style={styles.authContent}>
            {/* Render the authentication form and pass down props */}
            <AuthForm
                isLogin={isLogin}
                onSubmit={submitHandler}
                credentialsInvalid={credentialsInvalid}
            />
            {/* Button to switch between login and signup modes */}
            <View style={styles.buttons}>
                <FlatButton onPress={switchAuthModeHandler}>
                    {isLogin ? 'Create a new user' : 'Log in instead'}
                </FlatButton>
            </View>
        </View>
    );
}

export default AuthContent;

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const styles = StyleSheet.create({
    authContent: {
        marginTop: height * 0.02, // Adjusted to 8% of screen height
        marginHorizontal: width * 0.08, // 8% of screen width
        padding: width * 0.04, // 4% of screen width
        borderRadius: 8,
        backgroundColor: Colors.primary800,
        elevation: 4,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
        minHeight: height * 0.4, // Set minimum height to 50% of screen height
    },
    buttons: {
        marginTop: height * 0.01, // 2% of screen height
    },
});