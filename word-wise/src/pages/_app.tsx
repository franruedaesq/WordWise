// import '../styles/globals.css'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app'
import { lightTheme, darkTheme } from '@/theme';
import { useState } from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import { AppHeader } from '@/components/AppBar';



export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <AppHeader title='WordWise'/>
        <main style={{ paddingTop: "70px" }} >
        <Component {...pageProps} />
        </main>
      </Provider>
    </ThemeProvider>
  )
}
