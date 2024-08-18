import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";

import { Colors } from '../../constants/Styles'; // Import styling constants

// Input component with validation highlighting

const { width, height } = Dimensions.get("window");
function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) {
  return (
    <View style={styles.inputContainer}>
      {/* Display the label and change color if input is invalid */}
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      {/* Text input field */}
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]} // Apply invalid styling if needed
        autoCapitalize="none" // Prevent auto-capitalization
        keyboardType={keyboardType} // Set the keyboard type
        secureTextEntry={secure} // Mask text for passwords
        onChangeText={onUpdateValue} // Trigger the callback on text change
        value={value} // Set the input value
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: height * 0.005, // 1% of screen height
  },
  label: {
    color: "black",
    marginBottom: height * 0.005, // 0.5% of screen height
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    paddingVertical: height * 0.01, // 2% of screen height
    paddingHorizontal: width * 0.04, // 4% of screen width
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    fontSize: width * 0.04, // 4% of screen width
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});
