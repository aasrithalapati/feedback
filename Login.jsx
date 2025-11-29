import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    // Get users from localStorage
    const getUsers = () => {
        return JSON.parse(localStorage.getItem("users")) || [
            { id: 1, firstName: "Admin", lastName: "User", email: "admin@college.edu", password: "admin123", role: "admin" }
        ];
    };

    // Save user to localStorage
    const saveUser = (user) => {
        const users = getUsers();
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
    };

    // Handle login
    const handleLogin = (e) => {
        e.preventDefault();
        if (!email.trim() || !password) {
            setError("Please enter both email and password");
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);

        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            navigate(user.role === "admin" ? "/admin" : "/home");
        } else {
            const userExists = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
            setError(userExists ? "Incorrect password. Please try again." : "No account found. Please sign up.");
            if (!userExists) setIsSignup(true);
        }
    };

    // Handle signup
    const handleSignup = (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            setError("First and last name are required");
            return;
        }
        if (!email.trim() || !password || !confirmPassword) {
            setError("Please fill all fields");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const users = getUsers();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            setError("Email already registered");
            return;
        }

        const newUser = { id: Date.now(), firstName: firstName.trim(), lastName: lastName.trim(), email: email.toLowerCase().trim(), password, role: "student" };
        saveUser(newUser);
        alert("Account created successfully! Please login.");
        setIsSignup(false);
        setFirstName(""); setLastName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setError("");
    };

    // Toggle login/signup
    const toggleMode = () => {
        setIsSignup(!isSignup);
        setError(""); setFirstName(""); setLastName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>College Feedback System</h1>
                    <p>{isSignup ? "Create your account" : "Login to continue"}</p>
                </div>

                {!isSignup ? (
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="login-button">Login</button>
                        <div className="form-footer">
                            <p>Don't have an account? <span className="toggle-link" onClick={toggleMode}>Sign up here</span></p>
                        </div>
                    </form>
                ) : (
                    <form className="signup-form" onSubmit={handleSignup}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" minLength="6" required />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" minLength="6" required />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="signup-button">Sign Up</button>
                        <div className="form-footer">
                            <p>Already have an account? <span className="toggle-link" onClick={toggleMode}>Login here</span></p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;
Login.jsx