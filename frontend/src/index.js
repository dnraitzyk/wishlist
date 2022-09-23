import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from './App';
import "./styles/app.css";
import AddWish from './addWish';
import Login from './loginPage';
import Sidenav from './sidenav';
import Wishlist from './wishlist';
import ManageWishlist from './manageWishlist';
import { createAuthProvider } from 'react-token-auth';

export const { useAuth, authFetch, login, logout } =
    createAuthProvider({
        accessTokenKey: 'access_token',
        onUpdateToken: (token) => fetch('/refresh', {
            method: 'POST',
            body: token.access_token
        })
            .then(r => r.json())
    });
let logged;
const PrivateRoute = ({ component: Component, ...rest }) => {
    [logged] = useAuth();

    return <Route {...rest} render={(props) => (
        logged ? <Component {...props} />
            : <Navigate to='/loginPage' />
    )} />
}

const rootelem = document.getElementById('root');
const root = createRoot(rootelem);

root.render(
    // <StrictMode>
    <BrowserRouter>
        <Sidenav />
        <Routes>
            <Route path="/" element={<App />} />
            <PrivateRoute path="/loginPage" component={Login} />
            <Route path="/loginPage" element={<Login logged={logged} />} />
            <Route path="/addwish" element={<AddWish />} />
            <Route path="/wishlists" element={<Wishlist />} />
            <Route path="/manageWishlists" element={<ManageWishlist />} />
            <Route path="*" element={<App />} />
        </Routes>
    </BrowserRouter>
    // </StrictMode>
);