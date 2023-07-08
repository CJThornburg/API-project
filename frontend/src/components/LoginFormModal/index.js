import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginFormModel.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [frontErr, setFrontErr] = useState({})


  const handleDemo = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.thunkLogin({ credential:"user1@user.io", password: "password2" }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
  }



  useEffect(() => {
    const err = {}
    if (credential.length <4) err["pass"] = "Cred needs to be 5 or more characters"
    if (password.length < 6) err["cred"] = "Password needs 6 or more characters"

    setFrontErr(err)
    }
  )
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.thunkLogin({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="login-div">

      <h2 className="login-title">Log In</h2>
      {errors.credential && (
          <p className="error-text">{errors.credential}</p>
        )}
      <form className="login-form" onSubmit={handleSubmit}>
        <label  className="login-label">

          <input  className="login-input"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
          />
        </label >
        <label className="login-label">

          <input className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder=" Password"
          />
        </label>

        <button className="login-but" type="submit" disabled={frontErr["pass"] || frontErr['cred']}>Log In</button>
      </form>
      <p className="teal-text underline-text login-demo cursor" onClick={handleDemo}>Demo User</p>
    </div>
  );
}

export default LoginFormModal;
