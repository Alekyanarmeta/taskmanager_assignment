const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(" ")[1];
        console.log("token", token);
        console.log("secret", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("decoded", decoded);
        req.userId = decoded.userId;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = auth;
