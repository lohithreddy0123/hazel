// src/admin/AdminLogin.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";   // <-- FIXED

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);

      // Admin check
      if (user.user.email === "wearbyhazel@gmail.com") {
        window.location.href = "/admin";
      } else {
        alert("You are not an admin!");
        auth.signOut();
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}
