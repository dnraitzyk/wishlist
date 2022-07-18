import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

class Sidenav extends React.Component {
    render() {
        return <div className="sidenav">
            <div className="sidenavlink">
                <Link to="/addwish">Add Wish</Link>
            </div>
            <div className="sidenavlink">
                <Link to="/wishlists">Wishlists</Link>
            </div>
        </div>;
    }
}
export default Sidenav;

