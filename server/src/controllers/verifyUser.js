export function verifyUser(req, res) {
  const { username, email } = req.user; // decoded token data
  return res.json({
    message: "Welcome to your dashboard",
    username,
    email,
  });
}
