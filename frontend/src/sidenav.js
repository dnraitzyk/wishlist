import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { getLoggedInUser } from '.';


const UserInfo = (props) => {
    return getLoggedInUser() ? getLoggedInUser().username : null


}

function Sidenav(props) {
    const user = props.user

    return (
        <div className="sidenav">
            <div id="user">
                <UserInfo props={user}></UserInfo>
                {/* {getLoggedInUser() ? getLoggedInUser().username : null} */}
            </div>
            <div className="sidenavlink">
                <Link to="/app/addwish">Add Wish</Link>
            </div>
            <div className="sidenavlink">
                <Link to="/app/wishlists">Wishlists</Link>
            </div>
            <div className="sidenavlink">
                <Link to="/app/manageWishlists">Manage Wishlists</Link>
            </div>
            <div className="sidenavlink">
                <Link to="/loginPage">Login</Link>
            </div>
        </div>
    );
}
export default Sidenav;

