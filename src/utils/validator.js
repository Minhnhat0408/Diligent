import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import isLength from 'validator/lib/isLength';
import equals from 'validator/lib/equals';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isAlpha from 'validator/lib/isAlpha';
import { useState } from 'react';
import isAfter from 'validator/lib/isAfter';
function isNotEmpty(obj) {
    return !!obj && obj.trim();
}

function isImage(obj) {
    const metadata = {
        contentType: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
    };
    return metadata.contentType.includes(obj['type']);
}

function signUp({ email, password, confirmPass, name, dob, sex }) {
    const msg = {};

    if (!isNotEmpty(email)) {
        msg.email = !!msg.email ? msg.email : 'Please enter your email.';
    } else if (!isEmail(email)) {
        msg.email = !!msg.email ? msg.email : 'Your email is invalid.';
    }

    if (!isNotEmpty(password)) {
        msg.password = !!msg.password ? msg.password : 'Please enter your password.';
    } else if (!isStrongPassword(password)) {
        msg.password = !!msg.password ? msg.password : "Your password isn't strong enough. Ex: ab@C123hg";
    }
    if (!isNotEmpty(confirmPass)) {
        msg.confirmPass = !!msg.confirmPass ? msg.confirmPass : 'Please confirm your password.';
    } else if (!equals(confirmPass, password)) {
        msg.confirmPass = !!msg.confirmPass ? msg.confirmPass : 'Password confirmation does not match.';
    }

    return msg;
}

function signIn({ email, password }) {
    const msg = {};

    if (!isNotEmpty(email)) {
        msg.email = !!msg.email ? msg.email : 'Please enter your email.';
    } else if (!isEmail(email)) {
        msg.email = !!msg.email ? msg.email : 'Your email is invalid.';
    }

    if (!isNotEmpty(password)) {
        msg.password = !!msg.password ? msg.password : 'Please enter your password.';
    }
    return msg;
}

function updateProfile({ fullname, dob, phone, address, bio, avatar }) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear() - 1;

    today = mm + '-' + dd + '-' + yyyy;
    const msg = {};
    if (!isNotEmpty(fullname)) {
        msg.fullname = !!msg.fullname ? msg.fullname : 'Please enter your full name.';
    }

    if (!isNotEmpty(dob)) {
        msg.dob = !!msg.dob ? msg.dob : 'Please enter your date of birth.';
    } else if (isAfter(dob, today)) {
        msg.dob = !!msg.dob ? msg.dob : 'DOB invalid.';
    }
    if (!isNotEmpty(phone)) {
        msg.phone = !!msg.phone ? msg.phone : 'Please enter your phone number.';
    } else if (!isMobilePhone(phone)) {
        msg.phone = !!msg.phone ? msg.phone : 'This is not a phone number.';
    }
    if (!isNotEmpty(address)) {
        msg.address = !!msg.address ? msg.address : 'Please enter your address.';
    }
    if (!isNotEmpty(bio)) {
        msg.bio = !!msg.bio ? msg.bio : 'Please enter your bio.';
    }
    if (avatar) {
        if (!isImage(avatar)) {
            msg.avatar = !!msg.avatar ? msg.avatar : 'This is not an image.';
        }
    }

    return msg;
}

function updateUserProfile({ fullname, dob, phone, address, bio, avatar }) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear() - 1;

    today = mm + '-' + dd + '-' + yyyy;
    const msg = {};


    if (isNotEmpty(dob)) {
        if (isAfter(dob, today)) {
            msg.dob = !!msg.dob ? msg.dob : 'DOB invalid.';
        }
    } 
    if (isNotEmpty(phone)) {
        if (!isMobilePhone(phone)) {
            msg.phone = !!msg.phone ? msg.phone : 'This is not a phone number.';
        }
    }  
    if (avatar) {
        if (!isImage(avatar)) {
            msg.avatar = !!msg.avatar ? msg.avatar : 'This is not an image.';
        }
    }

    return msg;
}
const validator = {
    signIn,
    signUp,
    updateProfile,
    updateUserProfile
};

export default validator;
