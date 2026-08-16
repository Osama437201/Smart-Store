import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(null);

  const token = localStorage.getItem("token");

  const refreshWishlist = async () => {
    if (!token) {
      setWishlist(null);
      return;
    }

    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/Wishlist/get/client/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        setWishlist(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        refreshWishlist,
        totalItems: wishlist?.items?.length || 0,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}