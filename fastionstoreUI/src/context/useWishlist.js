import { useContext } from "react";
import { WishlistContext } from "./WishlistContext";

export const useWishlist = () => useContext(WishlistContext);