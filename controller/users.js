'use strict';
const mongoose = require("../models/index");
const user = require('../models/users')
var bcrypt = require('bcryptjs');
const classes = require('../models/classes');

const userController = {};

userController.getAllUser = async (req, res, next) => {
    try {
        const usersList = await user.find();
        res.render('layout', {
            contentPage: '../views/users/users',
            usersList: usersList
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}

userController.signUp = async (req, res, next) => {
    const userData = req.body
    try {
        const newUser = new user({
            username: userData.username,
            password: await bcrypt.hash(userData.password, 2),
            email: userData.email,
            firstName: userData.firstname,
            lastName: userData.lastname,
            phone: userData.phone,
            address: userData.address,
            teacher: false,
            admin: false
        });

        const userResult = await newUser.save();
        console.log(userResult)

        req.login(userResult, function (err) {
            res.redirect('/');
        })

    } catch (err) {
        if (err)
            console.log(err);
    }
}

userController.getUserDetail = async (req, res, next) => {
    const username = req.params.username;
    try {
        const userDetail = await user.findOne({
            username: username
        });
        const listClasses = await classes.find({
            classStudents: { $in: [username] }
        })
        console.log(username)
        console.log(listClasses)
        res.render('layout', {
            contentPage: '../views/users/userDetail',
            userDetail: userDetail,
            classesList: listClasses
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}

userController.getEditUser = async (req, res, next) => {
    const username = req.params.username;
    try {
        const userDetail = await user.findOne({
            username: username
        });
        console.log(username)
        res.render('layout', {
            contentPage: '../views/users/editUser',
            userDetail: userDetail
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}

userController.postEditUser = async (req, res, next) => {
    const userData = req.body
    const username = req.params.username;
    try {
        const userDetail = await user.findOne({
            username: username
        });
        userDetail.email = userData.email;
        userDetail.firstName = userData.firstName;
        userDetail.lastName = userData.lastName;
        userDetail.phone = userData.phone;
        userDetail.address = userData.address;

        const userResult = await userDetail.save();
        console.log(userResult)
        res.redirect("/users/user-detail/" + username)

    } catch (err) {
        console.log(err);
        throw err;
    }
}

userController.getInviteUser = async (req, res, next) => {
    const query = req.query;
    console.log(query)
    try {

        const users = await user.find();
        const classDetail = await classes.findOne({
            classCode: query.classCode
        })
        let resultListUser = new Array
        let j = 0
        for (var i = 0; i < users.length; i++) {
            if (classDetail.classStudents.indexOf(users[i]["username"]) == -1) {
                resultListUser[j] = users[i]
                j++
            }
        }
        console.log(resultListUser)
        res.send(resultListUser)

    } catch (err) {
        console.log(err);
        throw err;
    }
}

userController.getInviteTeacher = async (req, res, next) => {
    const query = req.query;
    console.log(query)
    try {

        const users = await user.find({
            teacher: true
        });
        const classDetail = await classes.findOne({
            classCode: query.classCode
        })
        let resultListUser = new Array
        let j = 0
        for (var i = 0; i < users.length; i++) {
            if (classDetail.classTeacher != users[i]["username"]) {
                resultListUser[j] = users[i]
                j++
            }
        }
        console.log(resultListUser)
        res.send(resultListUser)

    } catch (err) {
        console.log(err);
        throw err;
    }
}

userController.postInviteUser = async (req, res, next) => {
    const data = req.body;
    console.log(data)
    try {
        let classDetail = await classes.findOne({
            classCode: data.classCode
        });
        const userDetail = await user.findOne({
            username: data.username
        });
        if (classDetail.classStudents.indexOf(userDetail.username) == -1) {

            classDetail.classStudents.unshift(userDetail.username)
            const newClass = await classDetail.save()
            console.log(newClass)

            const resultUser = {
                username: userDetail.username,
                email: userDetail.email,
                firstName: userDetail.firstName,
                lastName: userDetail.lastName
            }
            res.send(resultUser)
        } else {
            res.send("user-existed")
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

userController.postInviteTeacher = async (req, res, next) => {
    const data = req.body;
    console.log(data)
    try {
        let classDetail = await classes.findOne({
            classCode: data.classCode
        });
        const userDetail = await user.findOne({
            username: data.username
        });
        if (classDetail.classTeachers.indexOf(userDetail.username) == -1) {

            classDetail.classTeachers.unshift(userDetail.username)
            const newClass = await classDetail.save()
            console.log(newClass)

            const resultUser = {
                username: userDetail.username,
                email: userDetail.email,
                firstName: userDetail.firstName,
                lastName: userDetail.lastName
            }
            res.send(resultUser)
        } else {
            res.send("teacher-existed")
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = userController;