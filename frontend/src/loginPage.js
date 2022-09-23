import React, { useState, useEffect, useRef } from 'react';
// import { AttemptLogin } from './apis';
import { login, logout } from './index';
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


function Login(props) {
  const logged = props.logged

  console.log("logged ", logged)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [fields, setFields] = useState({});

  function setInitialFields() {
    return { "username": username, "password": password };
  };

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
        if (authresp.data.access_token) {
          console.log("token found ", authresp.data.access_token)
          login(authresp.data.access_token)
        }
        else {
          console.log("No token found")
        }
      }

    }
    catch (e) {
      console.log("Error in AttemptLogin: " + e.message);
    }
  }


  const handleChange = setter => event => {
    console.log("running change")
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


      // alert("Form submitted");
      // let newlink = "";

      // if (link !== "" && !link.startsWith("https://")) {
      //     newlink = "https://" + link;
      //     setLink(newlink);
      // }
      AttemptLogin({ "username": username, "password": password })

      setUsername("");
      setPassword("");
      // setCost(0);
      // setQuantity("1");
      // setLink("");
      // setCategory("default");
      // setWishlist("Default");
      setFields(clearFields());
    } else {
      alert("Form has errors.");
    }

  }

  // function ShowMessage() {

  //   const [message, setMessage] = useState("");


  //   authFetch("/protected").then(response => {
  //     if (response.status === 401) {
  //       setMessage("Must login")
  //       return null
  //     }
  //     return response.json()
  //   }).then(response => {
  //     if (response && response.message) {
  //       setMessage(response.message)
  //     }
  //   })

  //   return message
  // }


  return (

    <div className='contentwrapper'>
      {/* <div>{ShowMessage()}</div> */}
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
        : <button onClick={() => logout()}>Logout</button>}
    </div>
  )
}

export default Login;