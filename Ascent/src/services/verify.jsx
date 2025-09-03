// api.js
export const verifyUser = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      credentials: "include", // very important to send cookies
    });
    if (!res.ok) throw new Error("Not authenticated");
    return await res.json();
  } catch (err) {
    return null;
  }
};
