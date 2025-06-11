const jwt = require("jsonwebtoken");

exports.googleLoginCallback = (req, res) => {
  const user = req.user;

  // Kiểm tra nếu bị khóa tài khoản
  if (user.isLock === 1 ) {
    return res.redirect("https://q-a-frontend.vercel.app/login?error=Tài khoản bị khóa hoặc chưa kích hoạt");
  }

  // Tạo JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avt: user.avt  
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Redirect về FE và truyền token qua URL
  return res.redirect(`https://q-a-frontend.vercel.app/google-auth?token=${token}`);
};
