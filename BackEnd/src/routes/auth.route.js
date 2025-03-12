const express = require("express") ; 
const{ login , signup , logout,updateProfile, checkAuth} = require("../controllers/auth.controller") ; 
const router = express.Router(); 
const {protectedRoute} = require("../middlewares/auth.middleware") ; 

router.post("/signup", signup) ;       

router.post("/login", login) ; 

router.post("/logout", logout) ; 

router.put("/update-profile" , protectedRoute , updateProfile)

router.get("/check" , protectedRoute , checkAuth) ; 


module.exports = router ; 
