import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const validateAndLogin = async (e) => {
        try {
            e.preventDefault();
            console.log(data);

            if (!data.email || !data.password) {
                alert("Please fill all the fields");
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/users/login",
                data
            );

            console.log("Response:", response.data);
            localStorage.setItem("token", response.data.token);
            alert("Login successful!");
            navigate("/home");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100 vw-100"
            style={{
                background: "linear-gradient(135deg, #43cea2, #185a9d)"
            }}
        >
            <div className="card shadow-lg p-4 rounded-4" style={{ width: "360px" }}>
                <div className="text-center mb-3">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        alt="login"
                        width="70"
                    />
                </div>

                <h3 className="text-center fw-bold text-primary mb-3">
                    Welcome Back
                </h3>

                <form onSubmit={validateAndLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            required
                            onChange={(e) =>
                                setData({ ...data, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            required
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100 fw-semibold"
                        type="submit"
                    >
                        Login
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small className="text-muted">
                        Don’t have an account?{" "}
                        <span
                            className="text-primary fw-semibold"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        >
                            Register
                        </span>
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Login;
