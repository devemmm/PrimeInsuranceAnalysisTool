const express = require("express");
const {
  index,
  signin,
  home,
  profile,
  surveyControll,
  createSurveyWithNewServices,
  newquetion,
  deleteService,
  getSurveyResponse,
  updateAccount,
  changePassword,
  signout,
} = require("../controller/AppController");

const route = express.Router();

route.get("/", index);

route.post("/signin", signin);

route.get("/home", home);

route.get("/survey", surveyControll);

route.post("/survey", createSurveyWithNewServices);

route.post("/user/acount", updateAccount);

route.post("/user/acount/password", changePassword);

route.post("/survey/newquetion", newquetion);

route.post("/delete/survey", deleteService);

route.get("/responses", getSurveyResponse);

route.get("/signout", signout);

route.get("/profile", profile);

route.get("*", (req, res) => {
  res.render("page404");
});

module.exports = route;
