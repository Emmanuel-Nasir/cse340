/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts =  require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities");
const pool = require("./database")
const session = require("express-session");
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const addAccountData = require("./middleware/accountContext")

/* ***********************
 * View Engine and Templates
 *************************/


app.use((req, res, next) => {
  res.locals.clientLoggedIn = req.session && req.session.user ? true : false;
  next();
});
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout","./layouts/layout")//not at views root
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
    cookie:{secure:false}
  })
)


app.use(require('connect-flash')())
app.use((req, res, next) => {
  res.locals.message = req.flash("notice")
  next()
})

app.use(function(req,res,next){
  res.locals.messages = require('express-messages')(req,res)
  next()
})
app.use((req, res, next) => {
  res.locals.clientLoggedIn = req.session && req.session.user ? true : false;
  res.locals.userName = req.session.user ? req.session.user.firstName : "";
  next();
});
app.use(addAccountData)
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute)
// file not found route -  must be last route in list
app.use(async(req,res, next)=>{
  next({status:404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async(err, req, res,next)=>{
  let nav = await utilities.getNav()
  console.error(`Error at:"${req.originalUrl}":${err.message}`)
  res.render("errors/error",{
    title:err.status || "server Error",
    message:err.message,
    nav,
  });
});