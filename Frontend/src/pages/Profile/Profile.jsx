import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { StoreContext } from "../../Context/StoreContext"
import "./Profile.css"

const Profile = ({ setShowLogin }) => {
  const { api, token, user, updateUser } = useContext(StoreContext)
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || "")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [passwordForCode, setPasswordForCode] = useState("")

  useEffect(() => {
    if (!token) {
      navigate("/")
      setShowLogin?.(true)
    }
  }, [navigate, setShowLogin, token])

  useEffect(() => {
    setName(user?.name || "")
  }, [user])

  const handleProfileSave = async (event) => {
    event.preventDefault()
    setMessage("")
    setError("")

    try {
      const res = await api.put("/api/auth/update-profile", { name })
      updateUser(res.data.user)
      setMessage("Profile updated successfully.")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.")
    }
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setMessage("")
    setError("")

    try {
      const res = await api.put("/api/auth/change-password", {
        oldPassword,
        newPassword
      })
      setMessage(res.data.message)
      setOldPassword("")
      setNewPassword("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.")
    }
  }

  const handleGenerateCode = async () => {
    setMessage("")
    setError("")

    try {
      const res = await api.post("/api/auth/regenerate-recovery-code", {
        password: passwordForCode
      })

      setRecoveryCode(res.data.recoveryCode)
      setMessage("New recovery code generated. Save it!")
      setPasswordForCode("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate code")
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* HEADER FIXED */}
        <div className="profile-header">
          <div>
            <p className="profile-eyebrow">Your account</p>
            <h2>{user?.name || "Profile"}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        {message && <p className="profile-message success">{message}</p>}
        {error && <p className="profile-message error">{error}</p>}

        <div className="profile-grid">

          {/* EDIT PROFILE */}
          <form className="profile-panel" onSubmit={handleProfileSave}>
            <h3>Edit profile</h3>
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Email
              <input value={user?.email || ""} disabled />
            </label>
            <button type="submit">Save profile</button>
          </form>

          {/* CHANGE PASSWORD */}
          <form className="profile-panel" onSubmit={handlePasswordChange}>
            <h3>Change password</h3>
            <label>
              Current password
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <button type="submit">Update password</button>
          </form>
        </div>

        {/* ✅ GENERATE RECOVERY CODE */}
        <div className="profile-panel">
          <h3>Generate Recovery Code</h3>

          <label>
            Enter password
            <input
              type="password"
              value={passwordForCode}
              onChange={(e) => setPasswordForCode(e.target.value)}
            />
          </label>

          <button type="button" onClick={handleGenerateCode}>
            Generate Code
          </button>

          {recoveryCode && (
            <p>
              Your Recovery Code: <strong>{recoveryCode}</strong>
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile