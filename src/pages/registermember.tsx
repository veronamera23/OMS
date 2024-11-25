import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, FormEvent } from "react";
import { auth, db } from "../firebaseConfig";
import { setDoc, doc, where, collection, query, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

function RegisterMember() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Input validation
  const validateInputs = (): boolean => {
    if (fname.trim().length < 3 || lname.trim().length < 3) {
      toast.error("First and Last name must be at least 3 characters.");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  // Check if email is unique
  const isEmailUnique = async (email: string): Promise<boolean> => {
    const memberQuery = query(collection(db, "members"), where("email", "==", email));
    const snapshot = await getDocs(memberQuery);
    return snapshot.empty;
  };

  // Register user and store data in Firestore
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Check for email uniqueness
      const emailIsUnique = await isEmailUnique(email);
      if (!emailIsUnique) {
        toast.error("Email already exists. Please choose another.");
        setLoading(false);
        return;
      }

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // User created successfully
      if (user) {
        const memberId = uuidv4(); // Generate unique member ID
        console.log("User created: ", user.uid);
        console.log("Member ID: ", memberId);

        // Combine first and last name to create fullName
        const fullName = `${fname} ${lname}`;

        // Save user data in Firestore under 'members' collection
        await setDoc(doc(db, "members", memberId), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          fullName: fullName,  // Store fullName here as well
          role: "member",
          joinedAt: new Date(),
        });

        // Save user info in 'Users' collection to link memberId with Firebase user
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          memberId: memberId, // Link to member document
          fullName: fullName,  // Store fullName in Users collection
          role: "member",
        });

        toast.success("User Registered Successfully! Redirecting...");
        setTimeout(() => (window.location.href = "/login"), 3000);
      }
    } catch (error) {
      // Log detailed error information for debugging
      const errorMessage = (error as Error).message || "An unexpected error occurred.";
      console.error("Registration Error: ", errorMessage);
      toast.error(errorMessage, {
        position: "bottom-center",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h3 className="register-title">Sign up</h3>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="label-text">First Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="First Name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="label-text">Last Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Last Name"
              onChange={(e) => setLname(e.target.value)}
              required
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
