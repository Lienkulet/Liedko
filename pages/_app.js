import { Layout } from "@/components"
import { CartContextProvider } from "@/context/StateContext"
import { createGlobalStyle } from "styled-components"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Recursive:wght@700&family=Roboto:wght@400;500;700&display=swap');

body{
  background-color: #eee;
  padding: 0;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
`

export default function App({ Component, pageProps: {
  session, ...pageProps
} }) {
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Layout>
            <Toaster />
            <Component {...pageProps} />
          </Layout>
        </CartContextProvider>
      </SessionProvider>
    </>
  )
}
