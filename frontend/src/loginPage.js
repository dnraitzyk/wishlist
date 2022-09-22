import React, { useState, useEffect, useRef } from 'react';
import { AttemptLogin } from './apis';

function isEmpty(str) {
  return (!str || str.length === 0);
}

function Login() {
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


  return (

    <div className='contentwrapper'>
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
    </div>
  )
}

export default Login;