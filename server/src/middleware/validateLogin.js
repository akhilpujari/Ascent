export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if ( !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  next(); // move to registerUser
}
