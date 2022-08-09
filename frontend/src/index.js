import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from 'App';
import "./styles/app.css";
import AddWish from './addWish';
import Sidenav from './sidenav';
import Wishlist from './wishlist';

const rootelem = document.getElementById('root');
const root = createRoot(rootelem);

root.render(
    // <StrictMode>
    <BrowserRouter>
        <Sidenav />
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/addwish" element={<AddWish />} />
            <Route path="/wishlists" element={<Wishlist />} />
            <Route path="*" element={<App />} />
        </Routes>
    </BrowserRouter>
    // </StrictMode>
);