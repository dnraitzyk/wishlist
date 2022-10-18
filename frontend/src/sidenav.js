import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { getLoggedInUser } from '.';


const UserInfo = (props) => {
  return getLoggedInUser() ? getLoggedInUser().username : null
}

function Sidenav(props) {
  const user = props.user

  const [isActive, setActive] = useState(false);

  const [isDropdownActive, setDropdownActive] = useState("false");
  var barsIcon = <img src={require("./images/list.svg").default} />
  var crossIcon = <i className="fas fa-times-circle"></i>
  return (
    <div className={isActive ? "sidebarflex active" : "sidebarflex inactive"} >
      < div className="wrapper" >
        <nav id="sidebar" className={isActive ? "active" : "inactive"}>
          <button
            type="button"
            id="sidebarCollapse"
            onClick={() => setActive(!isActive)}
            className="btn-custom"
          >
            <span className={isActive ? 'hidden' : ''}>{barsIcon}</span>
            <span className={isActive ? '' : 'hidden'}>{barsIcon}</span>
          </button>
          <div className="sidebar-header">
            <div className='sidebar-user'>
              <img
                // src={image}
                className={isActive ? "rounded-circle usr-image active" : "rounded-circle usr-image"}
              ></img>
              <div>
                <UserInfo props={user}></UserInfo>
              </div>
            </div>
          </div>

          <ul className="list-unstyled components">
            <li className="list-item">
              {/* <i className="fas fa-briefcase icon-color"></i> */}
              <Link className="collapselink" to="/app/addwish"><img src={require("./images/pluscircledotted.svg").default} /></Link>
              <Link to="/app/addwish">Add Wish</Link>
            </li>
            <li className="list-item">
              <Link className="collapselink" to="/app/wishlists"><img src={require("./images/listcheck.svg").default} /></Link>
              <Link to="/app/wishlists">Wishlists</Link>
            </li>
            {/* <li className="list-item">
                <i className="fas fa-user-alt icon-color"></i>
                <Link
                  to="/portfolio"
                  href="#homeSubmenu"
                  data-toggle="collapse"
                  aria-expanded="false"
                  className="dropdown-toggle"
                  onClick={() => setDropdownActive(!isDropdownActive)}
                >
                  My Space
                </Link>
                <ul
                  className={
                    isDropdownActive ? "list-unstyled  collapse" : "list-unstyled"
                  }
                  id="homeSubmenu"
                >
                  <li className="dropdown-item">
                    <Link to="/portfolio">Portfolio</Link>
                    <a href="#">Portfolio</a>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/personal-details">Personal Details</Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/additional-info">Additional Info</Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/personal-background">Personal Background</Link>
                  </li>
                </ul>
              </li> */}
            <li className="list-item">
              <Link className="collapselink" to="/app/manageWishlists"><img src={require("./images/cloudplus.svg").default} /></Link>
              <Link to="/app/manageWishlists">Manage Wishlists</Link>
            </li>
            <li className="list-item">
              <Link className="collapselink" to="/loginPage"><img src={require("./images/key.svg").default} /></Link>
              <Link to="/loginPage">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default Sidenav;

