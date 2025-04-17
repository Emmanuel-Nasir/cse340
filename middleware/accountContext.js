function addAccountData(req, res, next) {
    if (req.session && req.session.user) {
      res.locals.accountData = req.session.user
    } else {
      res.locals.accountData = null
    }
    next()
  }
  
  module.exports = addAccountData
  
  