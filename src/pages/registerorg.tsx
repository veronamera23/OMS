import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, FormEvent } from "react";
import { auth, db } from "../firebaseConfig";
import { setDoc, doc, where, collection, query, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; 

function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [oname, setOname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Function to validate input fields
  const validateInputs = (): boolean => {
    if (oname.trim().length < 3) {
      toast.error("Organization name must be at least 3 characters.");
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

  // Function to check if the organization name is unique
  const isOrganizationNameUnique = async (oname: string): Promise<boolean> => {
    const orgQuery = query(collection(db, "Organizations"), where("name", "==", oname));
    const snapshot = await getDocs(orgQuery);
    return snapshot.empty; // Returns true if no organization with this name exists
  };

  // Function to handle the registration process
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!validateInputs()) return; // If validation fails, stop further execution
  
    setLoading(true); // Set loading state to true while processing
    try {
      // Check if the organization name is unique
      if (!(await isOrganizationNameUnique(oname))) {
        toast.error("Organization name already exists. Please choose another.");
        setLoading(false);
        return;
      }
  
      // Create a new user with the provided email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get user object from returned credential
  
      if (user) {
        console.log("User created: ", user.uid);
  
        // Generate a unique organizationId
        const organizationId = uuidv4();
        console.log("Organization ID: ", organizationId);
  
        // Save the organization data in the Organizations collection
        await setDoc(doc(db, "Organizations", organizationId), {
          name: oname,
          email: user.email,
          photo: "",
          members: [user.uid],
          createdAt: new Date(),
        });
  
        // Save the user data in the Users collection
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          organizationId: organizationId,
          role: "organization",
        });
  
        toast.success("User Registered Successfully! Redirecting...");
        setTimeout(() => (window.location.href = "/login"), 3000);
      }
  
    } catch (error) {
      const errorMessage = (error as Error).message || "An unexpected error occurred.";
      console.log(errorMessage);
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
            <label className="label-text">Organization Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Organization Name"
              onChange={(e) => setOname(e.target.value)}
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

export default Register;
