const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('./cookieParser.js');

module.exports.createSession = (req, res, next) => {
  var session = {};
  if (req.cookies === undefined || Object.keys(req.cookies).length === 0) {
    models.Sessions.create()
      .then((data) => {
        return models.Sessions.get({id: data.insertId});      
      }).then(data => {
        // console.log(req.jar, res.jar);
        session.hash = data.hash;
        req.session = session;
        res.cookie('shortlyid', data.hash);
        next();
      });
  } else {
    models.Sessions.get({hash: req.cookies.shortlyid})
      .then((data) => {
        if (data) {
          session.hash = data.hash;
          if (data.user) {
            session.user = {username: data.user.username};
            session.userId = data.userId;
          }
          req.session = session;
          next();
        } else {
          models.Sessions.create()
            .then((data) => {
              return models.Sessions.get({id: data.insertId});
            }).then (data => {
              res.cookie('shortlyid', data.hash);
              next();
            });
          req.session = session;
        }
      });
  }
    
};

// module.exports.checkSession = (req, res, next) => {
  
// };

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

