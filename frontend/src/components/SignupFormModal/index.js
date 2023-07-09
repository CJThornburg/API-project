import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [dis, setDis] = useState(true)
  const [frontErr, setFrontErr] = useState({})
  const [sub, setSub] = useState(false)


  const handleSubmit = (e) => {
    e.preventDefault();
    setSub(true)
    if (Object.keys(frontErr).length > 0) return
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.thunkSignup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          console.log(data)
          if (data && data.errors) {
            setErrors(data.errors);
            console.log(errors)
          }
        });
    }

    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };
  console.log(errors)

  useEffect(() => {
    const err = {}

    if (email === "") err["email"] = "email is required"
    if (username === "") err["username"] = "username is required"
    if (firstName === "") err["firstName"] = "First name is required"
    if (lastName === "") err["lastName"] = "Last name is required"
    if (password === "") err["password"] = "Password is required"
    if (confirmPassword === "") err["confirmPassword"] = "confirmPassword is required"
    // if (confirmPassword !== password) err["match"] = "Password and Confirm password do not match"


 if(sub) {
  if (username.length < 4) err["user"] = "Username needs to be at least 4 characters"
  if (password.length < 6) err["pass"] = "Password needs to be at least 6 characters"
 }



    setFrontErr(err)
    // console.log(frontErr, err)
    if (Object.keys(err).length === 0) {
      setDis(false)
    } else {
      setDis(true)
    }
  }, [username, password, email, firstName, lastName, password, confirmPassword]
  )



  return (
    <> <div className="login-div">
      <h1 className="login-title">Sign Up</h1>

      <form className="login-form" id="signup" onSubmit={handleSubmit}>
        <label className="login-label">

          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
            placeholder="Email"
          />
        </label>
        {frontErr.email && sub && <p className="error-text">{frontErr.email}</p>}
        <label className="login-label">

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
            placeholder=" Username"
          />
        </label>
        {frontErr.username && sub && <p className="error-text">{frontErr.username}</p>}
        <label className="login-label">

          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="login-input"
            placeholder="  First Name"
          />
        </label>
        {frontErr.firstName && sub && <p className="error-text">{frontErr.firstName}</p>}
        <label className="login-label">

          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="login-input"
            placeholder=" Last Name"
          />
        </label>
        {frontErr.lastName && sub && <p className="error-text">{frontErr.lastName}</p>}
        <label className="login-label">

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
            placeholder=" Password"
          />
        </label>
        {frontErr.password && sub && <p className="error-text">{frontErr.password}</p>}
        <label className="login-label">

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="login-input"
            placeholder=" Confirm Password"
          />
        </label>
        {frontErr.confirmPassword && sub && (
          <p className="error-text">{frontErr.confirmPassword}</p>
        )}
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword}</p>
        )}
        {errors.email && <p className="error-text">email is already tied to an account </p>}
        {errors.username && <p className="error-text">{errors.username}</p>}
        {errors.password && <p className="error-text">{errors.password}</p>}
        {errors.firstName && <p className="error-text">{errors.firstName}</p>}
        {errors.lastName && <p className="error-text">{errors.lastName}</p>}
        <button className={dis ? "dis-login" : "login-but cursor"} type="submit" disabled={dis}>Sign Up</button>
      </form>
    </div>    </>
  );
}

export default SignupFormModal;
