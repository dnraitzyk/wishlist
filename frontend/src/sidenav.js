import React from 'react';
import { Link } from "react-router-dom";

function Sidenav() {
    return (
        <div className="sidenav">
            <div className="sidenavlink">
                <Link to="/addwish">Add Wish</Link>
            </div>
            <div className="sidenavlink">
                <Link to="/wishlists">Wishlists</Link>
            </div>
            <div className="sidenavlink">
                <Link to="/manageWishlists">Manage Wishlists</Link>
            </div>
        </div>
    );
}
export default Sidenav;

