
export async function logout(req, res) {
    try {
    // Clear the authentication token cookie
    res.clearCookie('token', {
      httpOnly:true,
    secure : false,
    sameSite : 'lax'
    });
    
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Failed to logout' });
  }
}

