import '../styles/globals.css'
import { Experimental_CssVarsProvider as CssVarsProvider }from '@mui/material/styles';

import type { AppProps } from 'next/app'
import theme from '@/theme';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider theme={theme}>
      <Component {...pageProps} />
    </CssVarsProvider>
  )
}
