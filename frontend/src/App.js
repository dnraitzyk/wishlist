import React, { StrictMode, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./styles/app.css";
import "./styles/sidebar.css";
import AddWish from './addWish';
import Login from './loginPage';
import Sidenav from './sidenav';
import MainHeader from './mainHeader';
import Wishlist from './wishlist';
import ManageWishlist from './manageWishlist';
import RequireAuth from './index'


function App(props) {
    const [useProdDB, setUseProdDB] = useState(false);


    const { user } = props;

    useEffect(() => {
    }, [useProdDB]);

    return (
        <div>
            <MainHeader useProdDB={useProdDB} setUseProdDB={setUseProdDB} />
            <div className="leaddiv">
                <BrowserRouter>
                    <Sidenav user={user} />
                    <Routes>
                        <Route
                            path="*"
                            element={
                                <RequireAuth redirectTo="loginPage">
                                    <Routes>
                                        <Route path="app/manageWishlists" element={<ManageWishlist />} />
                                        <Route path="app/wishlists" element={<Wishlist useProdDB={useProdDB} />} />
                                        <Route path="app/addwish" element={<AddWish />} />
                                        <Route path="*" element={<Wishlist />} />
                                    </Routes>
                                </RequireAuth>
                            }
                        />
                        <Route path="loginPage" element={<Login />} />
                    </Routes>
                </BrowserRouter >
            </div>
        </div>
    );
}

export default App;