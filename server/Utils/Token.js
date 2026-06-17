const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const safeUser = user.getSafeUser();
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: safeUser,
  });
};

module.exports = { sendTokenResponse };
