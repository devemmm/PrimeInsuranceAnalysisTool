const primeInsuranceApi = require("../api/primeInsuranceApi");
const moment = require("moment");

const subSurvey = [
  (req, res) => {
    res.send("hello");
  },
];

const index = [
  (req, res) => {
    res.render("signin");
  },
];

const signin = [
  async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      req.session.message = {
        type: "danger",
        intro: "Empty fields! ",
        message: "Please insert the requested information.",
      };
      return res.redirect("/home");
    }

    try {
      const response = await primeInsuranceApi.post("/signin", {
        email,
        password,
      });

      if (!response) {
        req.session.message = {
          type: "danger",
          intro: "System ",
          message: "something went wrong ",
        };
        return res.redirect("/");
      }

      res.cookie("data", response.data);

      res.redirect("/home");
    } catch (error) {
      req.session.message = {
        type: "danger",
        intro: "System ",
        message: error.response.data.error.message,
      };
      return res.redirect("/");
    }
  },
];

const arrangem = (data) => {
  const very_satisfied_n = [],
    very_satisfied_d = [],
    satisfied_n = [],
    satisfied_d = [],
    neither_satisfied_nor_dissatisfied_n = [],
    neither_satisfied_nor_dissatisfied_d = [],
    dissatisfied_n = [],
    dissatisfied_d = [],
    verry_dissatisfied_n = [],
    verry_dissatisfied_d = [];

  data.very_satisfied.forEach((s) => {
    very_satisfied_n.push(s.service);
    very_satisfied_d.push(s.total);
  });
  data.satisfied.forEach((s) => {
    satisfied_n.push(s.service);
    satisfied_d.push(s.total);
  });
  data.neither_satisfied_nor_dissatisfied.forEach((s) => {
    neither_satisfied_nor_dissatisfied_n.push(s.service);
    neither_satisfied_nor_dissatisfied_d.push(s.total);
  });
  data.dissatisfied.forEach((s) => {
    dissatisfied_n.push(s.service);
    dissatisfied_d.push(s.total);
  });
  data.verry_dissatisfied.forEach((s) => {
    verry_dissatisfied_n.push(s.service);
    verry_dissatisfied_d.push(s.total);
  });

  return {
    very_satisfied_n,
    very_satisfied_d,
    satisfied_n,
    satisfied_d,
    neither_satisfied_nor_dissatisfied_n,
    neither_satisfied_nor_dissatisfied_d,
    dissatisfied_n,
    dissatisfied_d,
    verry_dissatisfied_n,
    verry_dissatisfied_d,
  };
};

const generateReport = [
  async (req, res) => {
    try {
      const { data } = req.cookies;

      const { user, token } = data;

      await primeInsuranceApi.get("/responses/survey/report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      req.session.message = {
        type: "success",
        intro: "System ",
        message:
          "report sent to your email address Please check... make sure the your account email was been verfied and valid",
      };
      return res.redirect("/home");
    } catch (error) {
      req.session.message = {
        type: "danger",
        intro: "System ",
        message: error.response.data.error.message,
      };
      return res.redirect("/home");
    }
  },
];

const home = [
  async (req, res) => {
    const { data } = req.cookies;

    if (!data) {
      req.session.message = {
        type: "danger",
        intro: "System ",
        message: "you must be login",
      };
      return res.redirect("/");
    }

    try {
      const { user, token } = data;
      res.render("home", {
        user,
      });
    } catch (error) {
      console.log(error.response.data.error.message);
      res.render("page4004");
    }
  },
];

const profile = [
  (req, res) => {
    const { data } = req.cookies;

    if (!data) {
      req.session.message = {
        type: "danger",
        intro: "System ",
        message: error.response.data.error.message,
      };

      return res.redirect("/");
    }

    const { user, token } = data;

    res.render("profile", { user });
  },
];

const surveyControll = [
  async (req, res) => {
    try {
      const { data } = req.cookies;

      if (!data) {
        req.session.message = {
          type: "danger",
          intro: "System ",
          message: "you must be login",
        };
        return res.redirect("/");
      }
      const response = await primeInsuranceApi.get("/services");
      const service = response.data.service;

      res.render("survey", {
        service,
      });
    } catch (error) {
      res.render("page404");
    }
  },
];

const createSurveyWithNewServices = [
  async (req, res) => {
    try {
      const { token } = req.cookies.data;

      const { service, description, q1, q2, q3, q4, q5 } = req.body;

      const questions = [
        { question: q1 },
        { question: q2 },
        { question: q3 },
        { question: q4 },
        { question: q5 },
      ];

      await primeInsuranceApi.post(
        "/survey/register/newservice",
        { service, description, questions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      res.redirect("/survey");
    } catch (error) {
      console.log(error.response.data.error.message);
      res.render("page404");
    }
  },
];

const newquetion = [
  async (req, res) => {
    try {
      const { service, question } = req.body;
      const { token } = req.cookies.data;
      await primeInsuranceApi.patch(
        "/survey/register/newquestion",
        { service, question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      res.redirect("/survey");
    } catch (error) {
      res.render("page404");
    }
  },
];

const deleteService = [
  async (req, res) => {
    try {
      const { service } = req.body;
      const { token } = req.cookies.data;
      await primeInsuranceApi.delete(`/survey/${service}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      res.redirect("/survey");
    } catch (error) {
      console.log(error.response.data.error);
      res.render("page404");
    }
  },
];

const getSurveyResponse = [
  async (req, res) => {
    try {
      const { data } = req.cookies;

      if (!data) {
        req.session.message = {
          type: "danger",
          intro: "System ",
          message: "you must be login",
        };
        return res.redirect("/");
      }
      const response = await primeInsuranceApi.get("/responses/survey");

      const dataa = response.data.surveyResponses;
      res.render("surveyresponse", {
        data: dataa,
      });
    } catch (error) {
      res.render("page404");
    }
  },
];

const updateAccount = [
  async (req, res) => {
    try {
      const { fullName } = req.body;
      const { token } = req.cookies.data;

      const { data } = req.cookies;

      if (!data) {
        req.session.message = {
          type: "danger",
          intro: "System ",
          message: "you must be login",
        };
        return res.redirect("/");
      }
      let fname = "",
        lname = "";
      fname = fullName.split(" ")[0];

      fullName.split(" ")[2]
        ? (lname = fullName.split(" ")[1] + fullName.split(" ")[2])
        : (lname = fullName.split(" ")[1]);

      req.body.fname = fname;
      req.body.lname = lname;

      delete req.body.fullName;

      const response = await primeInsuranceApi.patch(
        "/users/account",
        { ...req.body },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      req.session.message = {
        type: "success",
        intro: "Your Account updated successfull",
        message: "!!!",
      };

      await res.cookie("data", { user: response.data, token });
      res.redirect("/profile");
    } catch (error) {
      res.render("page404");
    }
  },
];

const changePassword = [
  async (req, res) => {
    try {
      const { oldpassword, newpassword, newpassword2 } = req.body;

      if (newpassword !== newpassword2) {
        req.session.message = {
          type: "danger",
          intro: "Password does not match",
          message: "!!!",
        };

        return res.redirect("/profile");
      }
      await primeInsuranceApi.patch(
        "/users/account",
        { password: newpassword },
        {
          headers: {
            Authorization: `Bearer ${req.cookies.data.token}`,
          },
        }
      );
      req.session.message = {
        type: "success",
        intro: "Your Account password updated successfull",
        message: "!!!",
      };

      res.render("profile");
    } catch (error) {
      res.render("page404");
    }
  },
];

const fetchComment = [
  async (req, res) => {
    try {
      const comments = await primeInsuranceApi.get("responses/survey/comment");
      res.render("messages", {
        data: comments?.data?.comment,
      });
    } catch (error) {
      res.render("page404");
    }
  },
];
const signout = [
  (req, res) => {
    try {
      res.clearCookie("data");
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.render("page404");
    }
  },
];
module.exports = {
  index,
  signin,
  home,
  profile,
  surveyControll,
  createSurveyWithNewServices,
  newquetion,
  deleteService,
  getSurveyResponse,
  generateReport,
  updateAccount,
  changePassword,
  fetchComment,
  signout,
};
