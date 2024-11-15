import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, FormEvent } from "react";
import { auth, db } from "../firebaseConfig"; // Ensure this path is correct
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

function RegisterMember() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
          role: "member",
        });
      }
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      const errorMessage = (error as Error).message || "An unexpected error occurred.";
      console.log(errorMessage);
      toast.error(errorMessage, {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h3 className="register-title">Sign Up</h3>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="label-text">First Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="label-text">Last Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="label-text">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="label-text">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>

          <p className="forgot-password">
            Already registered? <a href="/login" className="text-blue-400">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterMember;
