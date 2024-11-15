import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import React, { useState, FormEvent } from "react";
import { auth } from "../firebaseConfig";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");

      const userDoc = await getDoc(doc(db, "Users", userCredential.user.uid));
      const userData = userDoc.data();

      if (userData?.role === "member") {
        router.push("/memberpage");
      } else if (userData?.role === "organization") {
        router.push("/orgpage");
      } else {
        router.push("/restricted");
      }

      toast.success("User logged in successfully", { position: "top-center" });
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result);
      toast.success("Signed in with Google successfully", { position: "top-center" });
      window.location.href = "/profile";
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  const handleFacebookSignUp = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Facebook sign-in successful:", result);
      toast.success("Signed in with Facebook successfully", { position: "top-center" });
      window.location.href = "/profile";
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <h3 className="login-title">Login</h3>

          <div className="mb-3">
            <label className="label-text">Email address</label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="label-text">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="login-button">
              Submit
            </button>
          </div>
          <p className="forgot-password text-center">
            New user? <a href="/choose">Register Here</a>
          </p>
          
          <br />

          <hr />

          <p className="social-login">
            or Sign In With
          </p>

          {/* Enhanced Social Login options with logos and labels */}
          <div className="social-login-options text-center mt-4">
            <button onClick={handleGoogleSignUp} className="social-login-button google">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google Logo" className="social-logo" />
              <span>Google</span>
            </button>
            <button onClick={handleFacebookSignUp} className="social-login-button facebook">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Logo" className="social-logo" />
              <span>Facebook</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
