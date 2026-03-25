import { useContext, useState } from "react"
import axios from "axios"
import { StoreContext } from "../../context/StoreContext"
import { assets } from "../../assets/assets"
import "./LoginPop.css"

const LoginPopup = ({ setShowLogin }) => {
  const { url, login } = useContext(StoreContext)

  const [currState, setCurrState] = useState("Login")
  const [data, setData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")

  // Forgot password state
  const [forgotData, setForgotData] = useState({
    email: "", recoveryCode: "", newPassword: ""
  })
  const [forgotError, setForgotError] = useState("")
  const [forgotSuccess, setForgotSuccess] = useState("")

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
    setError("")
  }

  const onForgotChangeHandler = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value })
    setForgotError("")
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      if (currState === "Login") {
        const res = await axios.post(url + "/api/auth/login", {
          email: data.email,
          password: data.password
        })
        login(res.data.token, res.data.user)
        setShowLogin(false)
      } else {
        const res = await axios.post(url + "/api/auth/signup", {
          name: data.name,
          email: data.email,
          password: data.password,
          role: "customer"
        })
        setRecoveryCode(res.data.recoveryCode)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotError("")
    setForgotSuccess("")
    try {
      const res = await axios.post(url + "/api/auth/forgot-password", {
        email: forgotData.email,
        recoveryCode: forgotData.recoveryCode,
        newPassword: forgotData.newPassword
      })
      setForgotSuccess(res.data.message)
      setTimeout(() => {
        setCurrState("Login")
        setForgotSuccess("")
        setForgotData({ email: "", recoveryCode: "", newPassword: "" })
      }, 2000)
    } catch (err) {
      setForgotError(err.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="login-popup">
      <div className="login-popup-container">

        {/* Close */}
        <img
          src={assets.cross_icon}
          alt="close"
          className="login-popup-close"
          onClick={() => setShowLogin(false)}
        />

        {/* Recovery code screen after signup */}
        {recoveryCode ? (
          <div className="recovery-code-screen">
            <h2>Account Created! 🎉</h2>
            <p>Save this recovery code safely. You will need it to reset your password.</p>
            <div className="recovery-box">{recoveryCode}</div>
            <p className="recovery-warning">⚠️ This will NOT be shown again!</p>
            <button onClick={() => { setRecoveryCode(""); setCurrState("Login") }}>
              Go to Login
            </button>
          </div>

        ) : currState === "Forgot Password" ? (
          /* Forgot Password Form */
          <div>
            <h2>Reset Password</h2>
            <p className="forgot-subtitle">Enter your email and recovery code from signup</p>

            {forgotError && <p className="login-error">{forgotError}</p>}
            {forgotSuccess && <p className="login-success">{forgotSuccess}</p>}

            <form onSubmit={handleForgotPassword} className="login-popup-inputs">
              <input
                name="email"
                type="email"
                placeholder="Your email"
                value={forgotData.email}
                onChange={onForgotChangeHandler}
                required
              />
              <input
                name="recoveryCode"
                type="text"
                placeholder="Recovery code (e.g. A3F2B1C9E4D7)"
                value={forgotData.recoveryCode}
                onChange={onForgotChangeHandler}
                required
              />
              <input
                name="newPassword"
                type="password"
                placeholder="New password (min 6 characters)"
                value={forgotData.newPassword}
                onChange={onForgotChangeHandler}
                required
              />
              <button type="submit">Reset Password</button>
            </form>

            <p className="switch-link">
              Remember password?{" "}
              <span onClick={() => setCurrState("Login")}>Login here</span>
            </p>
          </div>

        ) : (
          /* Login / Signup Form */
          <>
            <h2>{currState}</h2>
            {error && <p className="login-error">{error}</p>}

            <form onSubmit={onSubmit} className="login-popup-inputs">
              {currState === "Sign Up" && (
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={data.name}
                  onChange={onChangeHandler}
                  required
                />
              )}
              <input
                name="email"
                type="email"
                placeholder="Your email"
                value={data.email}
                onChange={onChangeHandler}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={onChangeHandler}
                required
              />

              {/* Forgot password link — only on login */}
              {currState === "Login" && (
                <p
                  className="forgot-link"
                  onClick={() => setCurrState("Forgot Password")}
                >
                  Forgot Password?
                </p>
              )}

              <button type="submit">
                {currState === "Login" ? "Login" : "Create account"}
              </button>
            </form>

            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>

            {currState === "Login" ? (
              <p className="switch-link">
                Create a new account?{" "}
                <span onClick={() => setCurrState("Sign Up")}>Click here</span>
              </p>
            ) : (
              <p className="switch-link">
                Already have an account?{" "}
                <span onClick={() => setCurrState("Login")}>Login here</span>
              </p>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default LoginPopup