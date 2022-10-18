import React, { useState, useEffect, useRef } from 'react';
// import { AttemptLogin } from './apis';
import { login, logout, handleLogoutActions } from './index';
// import { createAuthProvider } from 'react-token-auth';
import axios from 'axios';



// export const { useAuth, authFetch, login, logout } =
//   createAuthProvider({
//     accessTokenKey: 'access_token',
//     onUpdateToken: (token) => fetch('/refresh', {
//       method: 'POST',
//       body: token.access_token
//     })
//       .then(r => r.json())
//   });

function isEmpty(str) {
  return (!str || str.length === 0);
}


function Login() {
  // const logged = props.logged

  // console.log("logged ", logged)
  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("test");
  const [errors, setErrors] = useState({});
  const [fields, setFields] = useState({});
  const [logged, setLogged] = useState(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
  // function setInitialFields() {
  //   return { "username": username, "password": password };
  // };
  // setFields({ "username": "dnraitzyktest", "password": "test" })
  useEffect(() => {
    setFields({ "username": "test", "password": "test" })


  }, []);

  function clearFields() {
    return { "username": "", "password": "" }
  };


  async function AttemptLogin(body) {
    try {
      let authresp = await axios.post(process.env.REACT_APP_BASE_URL + '/login', body, {
        headers: {
          'content-type': 'application/json'
        }
      }).catch(function (err) {
        if (err.response) {
          console.log("err.response ", err.response)
        }
        else if (err.request) {
          console.log("err.request ", err.request)
        }
        else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error ', err.message);
        }
      });

      if (authresp) {
        if (authresp.data.user.access_token) {
          const token = authresp.data.user.access_token
          const user = JSON.stringify(authresp.data.user)
          localStorage.setItem('user', user)
          login(token)
          return token
        }
        else {
          console.log("No token found")
          return null
        }
      }

    }
    catch (e) {
      console.log("Error in AttemptLogin: " + e.message);
    }
  }


  const handleChange = setter => event => {
    // console.log("running change")
    const { name, value } = event.target;

    setFields({ ...fields, [name]: value });

    setter(value)
  }

  const handleValidation = (sfields) => {

    let fields = sfields;
    let errors = {};
    let formIsValid = true;

    if (isEmpty(fields["username"])) {
      formIsValid = false;
      errors["username"] = "Must enter username";
    }

    if (isEmpty(fields["password"])) {
      formIsValid = false;
      errors["password"] = "Must enter password";
    }


    setErrors(errors);
    return formIsValid;
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (handleValidation(fields)) {

      AttemptLogin({ "username": username, "password": password }).then(r => setLogged(r))

      setUsername("");
      setPassword("");

      setFields(clearFields());
    } else {
      alert("Form has errors.");
    }

  }

  const handleLogout = () => {
    handleLogoutActions();
    setLogged("")
    setFields({ "username": "test", "password": "test" })
    setUsername("test");
    setPassword("test");
  }
  return (

    <div className='contentwrapper flex'>
      {!logged ?
        <form>
          <fieldset>
            <label>
              <p>Username</p>
              <input name="username" placeholder="Username" value={username} onChange={handleChange(setUsername)} />
            </label>
            <span style={{ color: "red" }}>{errors["username"]}</span>
            <br />
            <label>
              <p>Password</p>
              <span >
                <input name="password" placeholder="Password" value={password} onChange={handleChange(setPassword)} />
              </span>
            </label>
            <span style={{ color: "red" }}>{errors["password"]}</span>
            <br />
          </fieldset>
          <button className="typicalbutton" type="submit" onClick={(e) => handleSubmit(e)}>
            Submit
          </button>
        </form>
        : <button id="logoutbutton" className="typicalbutton" onClick={() => handleLogout()}>Logout</button>}
    </div>
  )
}

export default Login;