import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import Button from "../ui/Button"; // Custom button component
import Input from "./Input"; // Custom input component

const { width, height } = Dimensions.get('window');
function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  // State to hold user inputs
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  // Destructure the invalid states passed from parent
  const {
    username: usernameIsInvalid,
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  // Handler to update the input fields
  function updateInputValueHandler(inputType, enteredValue) {
    // Set appropriate state based on input type
    switch (inputType) {
      case "username":
        setEnteredUsername(enteredValue);
        break;
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  // Handler for form submission
  function submitHandler() {
    // Collect all form values and pass to the parent submit handler
    onSubmit({
      username: enteredUsername,
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <View style={styles.form}>
      <View>
        {/* Username input */}
        <Input
          label="Username"
          onUpdateValue={updateInputValueHandler.bind(this, "username")}
          value={enteredUsername}
          isInvalid={usernameIsInvalid}
        />
        {/* Only show email fields when not in login mode */}
        {!isLogin && (
          <>
            <Input
              label="Email Address"
              onUpdateValue={updateInputValueHandler.bind(this, "email")}
              value={enteredEmail}
              keyboardType="email-address"
              isInvalid={emailIsInvalid}
            />
            <Input
              label="Confirm Email Address"
              onUpdateValue={updateInputValueHandler.bind(this, "confirmEmail")}
              value={enteredConfirmEmail}
              keyboardType="email-address"
              isInvalid={emailsDontMatch}
            />
          </>
        )}
        {/* Password input */}
        <Input
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(this, "password")}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        {/* Confirm password input, only in signup mode */}
        {!isLogin && (
          <Input
            label="Confirm Password"
            onUpdateValue={updateInputValueHandler.bind(
              this,
              "confirmPassword"
            )}
            secure
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}
        {/* Submission button */}
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;


const styles = StyleSheet.create({
  form: {
      marginTop: height * 0.01, // 2% of screen height
  },
  buttons: {
      marginTop: height * 0.02, // 3% of screen height
  },
});