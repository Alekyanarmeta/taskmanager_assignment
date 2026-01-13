import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Register() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (token) {
        navigate("/home");
    }

    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const saveDetails = async () => {
        try {
            console.log(data);

            if (!data.username || !data.email || !data.password) {
                alert("Please fill all the fields");
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/users/register",
                data
            );

            console.log("Response:", response.data);
            navigate("/login");
            alert("Registration successful! Please login.");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100 vw-100"
            style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)"
            }}
        >
            <div className="card shadow-lg p-4 rounded-4" style={{ width: "360px" }}>
                <div className="text-center mb-3">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        alt="user"
                        width="70"
                    />
                </div>

                <h3 className="text-center fw-bold text-primary mb-3">
                    Create Account
                </h3>

                <form onSubmit={saveDetails}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            required
                            onChange={(e) =>
                                setData({ ...data, username: e.target.value })
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
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
                            placeholder="Enter password"
                            required
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-semibold"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center mt-3 mb-0 text-muted">
                    Already have an account?{" "}
                    <span
                        className="text-primary fw-semibold"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;
