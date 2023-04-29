import Head from 'next/head'
import React from 'react'
import Center from './Center'
import { Featured, Footer, Header } from '.'

const Layout = ({children}) => {
  return (
    <>
    <Head>Liedko</Head>
    <Header />
    <main>
        <Center>
            {children}
        </Center>
    </main>
    <Footer />
    </>
  )
}

export default Layout