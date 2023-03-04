import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import createJWT from "../utils/auth.js";

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const isUserAuth = async (req, res) => {
  const { token } = req.headers;

  if (!token) {
    // console.log("No Token");
    return res.status(200).json({ success: false, message: "login please" });
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // console.log("isUserAuth: No Match");
        return res
          .status(200)
          .json({ success: false, message: "isUserAuth: login please" });
      }
      if (decoded) {
        // console.log("isUserAuth: decoded");
        return res.status(200).json({ success: true, message: "right User" });
      }
    });
  }
};

export const signUp = async (req, res) => {
  let { email, name, password, passwordConfirmation } = req.body;

  let errors = {};

  if (!name) {
    errors.userName = "required";
  }
  if (!email) {
    errors.userEmail = "required";
  }
  if (!emailRegexp.test(email)) {
    errors.userEmail = "invalid";
  }
  if (!password) {
    errors.password = "required";
  }
  if (!passwordConfirmation) {
    errors.confirmPassword = "required";
  }
  if (password != passwordConfirmation) {
    errors.confirmPassword = "incorrect";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(200).json({ success: false, errors: errors });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        errors.userEmail = "Email is already registered";
        return res.status(200).json({ success: false, errors: errors });
      } else {
        const user = new User({
          email: email,
          name: name,
          password: password,
        });
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then((user) => {
              let access_token = createJWT(
                user._id,
                user.email,
                user.name,
                3600
              );
              return res.status(200).json({
                success: true,
                token: access_token,
                message: `${user.name} | Registered Successfully`,
                user: {
                  userId: user._id,
                  userName: user.name,
                  userEmail: user.email,
                },
              });
            })
            .catch((err) => {
              res.status(500).json({
                success: false,
                message: "unexpected error occured",
                errors: { error: err.message },
              });
            });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "unexpected error occured",
        errors: [{ error: err.message }],
      });
    });
};

export const login = async (req, res) => {
  let { email, password } = req.body;

  let errors = {};

  if (!email) {
    errors.userEmail = "required";
  }
  if (!emailRegexp.test(email)) {
    errors.userEmail = "invalid";
  }
  if (!password) {
    errors.password = "required";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(200).json({ success: false, errors: errors });
  }

  User.findOne({ email: email })
    .then((user) => {
      // console.log(`user :${user}`);
      if (!user) {
        // console.log("errors: " + errors);
        errors.userEmail = "This Email is not registered";
        return res.status(200).json({ success: false, errors: errors });
      } else {
        // console.log("user in else:" + user);
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              // console.log("incorrect password" + errors);
              errors.password = "incorrect password";
              return res.status(200).json({ success: false, errors: errors });
            }
            let access_token = createJWT(user._id, user.email, user.name, 3600);
            return res.status(200).json({
              success: true,
              message: `user Authenticated`,
              token: access_token,
              user: {
                userId: user._id,
                userName: user.name,
                userEmail: user.email,
              },
            });
          })
          .catch((err) => {
            // console.log("error 1");
            res.status(500).json({
              success: false,
              message: "unexpected error occured",
              error: err.message,
            });
          });
      }
    })
    .catch((err) => {
      // console.log("error 2");
      res.status(500).json({
        success: false,
        message: "unexpected error occured",
        error: err.message,
      });
    });
};

export const editUser = async (req, res) => {
  let id = req.params.id;

  let { newEmail, newName, oldPassword, newPassword } = req.body;

  let noPasswords = false;

  // const user = {
  //   email:newEmail,
  //   name: newName,
  //   pass: oldPassword,
  //   newPass: newPassword
  // }

  // console.log(user);

  let errors = {};

  if (!emailRegexp.test(newEmail)) {
    errors.userEmail = "invalid";
  }
  if (!oldPassword && !newPassword) {
    noPasswords = true;
  } else if (!oldPassword) {
    errors.oldPassword = "required";
  } else if (!newPassword) {
    errors.newPassword = "required";
  }




  if (Object.keys(errors).length > 0) {

    // console.log(`Current line number: ${new Error().lineNumber}`);
    // console.trace();

    return res.status(200).json({ success: false, errors: errors });
  }


  if (!noPasswords) {
    User.findOne({ _id: id }).then((user) => {
      if (user) {
        bcrypt.compare(oldPassword, user.password).then((isMatch) => {
          if (!isMatch) {
            // console.log('pssword not matched...');
                // console.log(`Current line number: ${new Error().lineNumber}`);
                // console.trace();


            errors.oldPassword = "incorrect old Password";
            return res.status(200).json({ success: false, errors: errors });
          } else {
            // console.log('user Authenticated...');
            // console.log(`going to hash new password: "${newPassword}", ......`)


            bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
              if (err) {
                console.log(`Current line number: ${new Error().lineNumber}`);
                console.trace();



                return res.status(400).json({
                  success: false,
                  message: "unexpected hash error Occured",
                  error: err.message,
                });
              } else {
                newPassword = hash;

                User.findByIdAndUpdate(
                  id,
                  { email: newEmail, name: newName, password: newPassword },
                  { new: true }
                ).then((user) => {
                  if (user) {
                    // console.log("dbUser updated successfully......");
                    return res.status(200).json({
                      success: true,
                      message: "user updated successfully",
                      user: {
                        userId: user._id,
                        userName: user.name,
                        userEmail: user.email,
                      },
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    User.findByIdAndUpdate(
      id,
      { email: newEmail, name: newName },
      { new: true }
    ).then((user) => {
      if (user) {
        // console.log("dbUser updated successfully......");
        return res.status(200).json({
          success: true,
          // message: "user updated successfully",
          user: {
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
          },
        });
      }
    });
  }
};

export const deleteUser = async (req, res) => {
  let id = req.params.id;
  User.findByIdAndDelete(id, (err, user) => {
    if (err)
      return res.status(200).json({
        success: false,
        message: "unexpected error occured",
        error: err.message,
      });
    return res
      .status(200)
      .json({ success: true, message: `user deleted successfully` });
  });
};