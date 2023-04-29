import { toast } from "react-hot-toast";

const { createContext, useState, useEffect } = require("react");

export const CartContext = createContext({});

export function CartContextProvider({children}){
    const ls = typeof window !== 'undefined'? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState([]);
    const [loginMessage, setLoginMessage] = useState(false);

    useEffect(() => {
        if(cartProducts?.length > 0){
            ls.setItem('cart', JSON.stringify(cartProducts))
        }
    }, [cartProducts]);

    useEffect(() => {
        if(ls && ls.getItem('cart')){
            setCartProducts(
                JSON.parse(ls?.getItem('cart'))
            )
        }
    }, []);

    const addProduct = (productId) => {
        setCartProducts(prev => [...prev, productId]);
        toast.success('Product added successfully!');
    } 

    const removeProduct = (productId) => {
        setCartProducts(prev => {
            const pos = prev.indexOf(productId);
            if(pos !== -1){
                return prev.filter((val, index) => index !== pos);
            }
            return prev;
        })
    }

    const changeQty = (str, productId) => {
        if(str === 'inc'){
            addProduct(productId);
        }
        if(str === 'dec'){
            removeProduct(productId);
        }
    }

    const clearCart = () => {
        setCartProducts([]);
        ls.clear();
    }

    return(
        <CartContext.Provider value={{
            cartProducts, 
            setCartProducts,
            addProduct,
            changeQty,
            clearCart,
            loginMessage, 
            setLoginMessage,
        }}>
            {children}
        </CartContext.Provider>
    )
}