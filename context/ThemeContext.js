import React, { createContext, useState, useContext } from "react";
import { useColorScheme } from "nativewind";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const systemTheme = useColorScheme();
    const [theme, setTheme] = useState(systemTheme);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
        console.log(theme);
    };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
