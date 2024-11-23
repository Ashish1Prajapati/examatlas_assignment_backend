const jwt = require("jsonwebtoken");
function setUser(id, email, name) {
    try {
        return jwt.sign({ id: id, email: email, name: name }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES,
        });
    } catch (error) {
        console.error("Something went weong:", error.message)
    }

}
function getUser(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.error("Token verification error:", error.message);
        return null;
    }
}
module.exports = {
    setUser,
    getUser,
};
