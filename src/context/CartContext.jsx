import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  const token = localStorage.getItem("token");

  const refreshCart = async () => {
    if (!token) {
      setCart(null);
      return;
    }

    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/Cart/get/client/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        setCart(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        refreshCart,
        totalItems: cart?.totalItems || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}