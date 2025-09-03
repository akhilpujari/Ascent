export function validateRegister(req, res, next) {
  const { username, email, password,confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if(password!== confirmPassword){
    return res.status(400).json({ message: "password doest match" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  next(); // move to registerUser
}
