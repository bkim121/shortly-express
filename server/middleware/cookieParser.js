const parseCookies = (req, res, next) => {
  var result = {};

  if (req.headers && req.headers.cookie) {
    req.headers.cookie.split('; ').forEach(element => {
      var cookie = element.split('=');
      result[cookie[0]] = cookie[1];
    });
  }
  req.cookies = result;
  next();
};

module.exports = parseCookies;