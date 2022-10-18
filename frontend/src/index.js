import React from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate } from "react-router-dom";
import { createAuthProvider } from 'react-token-auth';
import App from './App';
import "./styles/app.css";
import "./styles/sidebar.css";
import jwtDecode from 'jwt-decode';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

let logged = localStorage.getItem("REACT_TOKEN_AUTH_KEY")

export const handleLogoutActions = () => {
    logout()
    localStorage.clear();
};

let user;

export function getLoggedInUser() {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
        try {
            const foundUser = JSON.parse(loggedInUser);
            const foundUsername = foundUser.userName;
            const foundToken = foundUser.access_token;
            user = foundUser;
        }
        catch (err) {
            console.log("Error in getLoggedInUser ", err)
        }
        return user;
    }
}


export const { useAuth, authFetch, login, logout } =
    createAuthProvider({
        accessTokenKey: localStorage.getItem("REACT_TOKEN_AUTH_KEY"),
        onUpdateToken: (token) => fetch('/refresh', {
            method: 'POST',
            body: token.access_token
        }).then(r => r.json())
    })


export default function RequireAuth({ children, redirectTo }) {
    logged = false
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY")
    if (token) {
        const decodedToken = jwtDecode(token)
        var dateNow = new Date();
        if (decodedToken.exp < dateNow.getTime())
            logged = true;
    }

    return logged ? children : <Navigate to={redirectTo} />;
}

const rootelem = document.getElementById('root');
const root = createRoot(rootelem);
user = getLoggedInUser();

root.render(

    <App user={user} />

);