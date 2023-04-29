import Link from 'next/link'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Center } from '.';
import { CartContext } from '@/context/StateContext';

const StyledHeader = styled.header`
 background-color: #222;
 position: sticky;
 top: 0;
 z-index: 10;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  position: relative;
  z-index: 3;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  display: block;
  gap: 10px;
  position: fixed;
  top: 10px;
  left: 0;
  right: 0;
  bottom: 0;

  padding:  70px 20px 20px;
  background-color: #222;

  height: fit-content;

  @media screen and (min-width: 800px) {
    display: flex;
    position: static;
    padding: 0;
  }
  

  ${props => props.navMenu ? `
    display: block;`
    :
    `display: none`
  }
  `;

const NavLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;
  padding: 10px 0;

  @media screen and (min-width: 800px) {
    padding: 0;
  }
`;

const NavBurger = styled.button`
  background-color: transparent;
  width: 40px;
  height: 40px;
  border: none;
  color: #fff;
  cursor: pointer;

  position: relative;
  z-index: 3;

  @media screen and (min-width: 800px) {
    display: none;
  }
`

const SideIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  a{
    display: inline-block;
    min-width: 20px;
    color: #fff;

  svg{
      width: 20px;
      height: 20px;
    }
  }
`

const Header = () => {
  const { cartProducts } = useContext(CartContext);
  const [navMenu, setNavMenu] = useState(false);

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={'/'}>Liedko</Logo>
          <StyledNav navMenu={navMenu}>
            <NavLink href={'/'}>Home</NavLink>
            <NavLink href={'/products'}>All products</NavLink>
            <NavLink href={'/categories'}>Categories</NavLink>
            <NavLink href={'/account'}>Account</NavLink>
            <NavLink href={'/CartPage'}>Cart ({cartProducts.length})</NavLink>
          </StyledNav>
          <SideIcons>
          <Link href={'/search'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <NavBurger onClick={() => setNavMenu(!navMenu)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </NavBurger>
          </SideIcons>
        </Wrapper>
      </Center>
    </StyledHeader>
  )
}

export default Header