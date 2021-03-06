module.exports = {
    ensureAuthenticated: function(req,res,next)
    {
      if(req.isAuthenticated()){
        return next();
      }
    //   req.flash('error_msg',"Not Authorized");
      res.redirect('/login');
    },
    ensureGuest: function(req, res, next){
      if(req.isAuthenticated()){
        res.redirect('/');
      } else {
        return next();
      }
    }
  }
  