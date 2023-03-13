import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword"
import isLength from "validator/lib/isLength";
import equals from "validator/lib/equals"
import { useState } from "react";

function isNotEmpty(obj) {
    return !!obj && obj.trim();
}

function signUp({ email, password, confirmPass, name, dob, sex }) {
  const msg = {};

  if (!isNotEmpty(email)) {
    msg.email = !!msg.email ? msg.email : "Please enter your email.";
  }else if (!isEmail(email)) {
      msg.email = !!msg.email ? msg.email : "Your email is invalid.";
    }

  if (!isNotEmpty(password)) {
    msg.password = !!msg.password
      ? msg.password
      : "Please enter your password.";
  } else if (!isStrongPassword(password)) {
    msg.password = !!msg.password
      ? msg.password
      : "Your password isn't strong enough. Ex: ab@C123hg";
  }
  if (!isNotEmpty(confirmPass)) {
    msg.confirmPass= !!msg.confirmPass
      ? msg.confirmPass
      : "Please confirm your password.";
  } else if (!equals(confirmPass,password)) {
    msg.confirmPass = !!msg.confirmPass
      ? msg.confirmPass
      : "Password confirmation does not match.";
  }

  return msg;
}

function signIn({ email, password }) {
  const msg = {};

  if (!isNotEmpty(email)) {
    msg.email = !!msg.email ? msg.email : "Please enter your email.";
  }else if (!isEmail(email)) {
      msg.email = !!msg.email ? msg.email : "Your email is invalid.";
    }

  if (!isNotEmpty(password)) {
    msg.password = !!msg.password
      ? msg.password
      : "Please enter your password.";
  } 
  return msg;
}


function updateProfile({ email, password }) {
  const msg = {};


  return msg;
}
const validator = {
  signIn ,
  signUp,
  updateProfile

}


export default validator;
