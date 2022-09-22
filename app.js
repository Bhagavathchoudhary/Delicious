const express = require('express');
const app = express();
const { check } = require('express-validator');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const port = 8900;
const connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "new_password",
    "database": "delicious"
})
app.set('views-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));





app.get('/DeliciousOffcialPage', (req, res) => {
    res.render('deliciousUi.ejs')
})
// breakfast page
app.get("/breakfastBuffet", (req, res) => {
    var breakfastBuffet = `select type, name,description,price from menu_items where type IN ("0","1","3") and category = "breakfast" order by type ASC`
    connection.query(breakfastBuffet, (err, result) => {
        if (err) throw err;
        else {
            res.render('./catalogs/breakfast_buffet.ejs', { breakfast: result }
            );
        }
    })
})
// lunch page 
app.get('/lunchBuffet', (req, res) => {
    var lunchBuffetQuery = `select type, name, description, price from menu_items   where type IN ("0","1","3") and category = "appetizer" order by type ASC`
    connection.query(lunchBuffetQuery, (err, result) => {
        if (err) return err
        else {
            res.render('./catalogs/lunch_buffet.ejs', { lunchbuffet: result })
        }
    })
})
//soup_salad_desert Page
app.get("/soup_salad_desert", (req, res) => {
    var soup_salad_desert_query = `select type,category, name, description,price from menu_items where type IN ("0","1","3") and category IN ("soups","desert","salads") order by type ASC`;
    connection.query(soup_salad_desert_query, (err, result) => {
        if (err) return err;
        else {
            res.render("./catalogs/soupsSaladDesert.ejs", { Soup_Salad_Desert: result })
        }
    })
})


// Resevation page for table

app.get("/reservation", (req, res) => {
    res.render("./reservation_page/reservation.ejs")
})

app.post("/booking_of_table", [check("email").isEmail()], (req, res) => {
    let name = req.body.Name;
    let email = req.body.Email;
    let phone_Number = req.body.phone_number;
    let date = req.body.DateTime.slice(0, 10)
    let time = req.body.DateTime.slice(11, 16)
    let duration = req.body.duration;
    let location = req.body.Location;
    let no_Of_Members = req.body.no_of_members;
    if ((name === undefined) || (email === undefined) || (phone_Number === undefined) || (date === undefined) || (time === undefined)) {
        res.render("./reservation_page/error.ejs")
    } else {
        var booking_of_table_query = `INSERT INTO reservation(name,phone,date,time,duration,location,noofperson,email) values('${name}',${phone_Number},'${date}','${time}','${duration}','${location}','${no_Of_Members}','${email}')`
        connection.query(booking_of_table_query, (err, result) => {

            if (err) {
                res.render("./reservation_page/error.ejs")
            }
            else {

                res.render("../register_login_page/register.ejs");
            }
        })
    }
})
// register the premium user page
app.get('/registerPremiumMembers', (req, res) => {
    res.render("../register_login_page/register.ejs")
})
app.post('/premiumUser', [check("email").isEmail()], async (req, res) => {
    let first_Name = req.body.First_Name;
    let last_Name = req.body.Last_Name;
    let gender = req.body.genders;
    let phone_Number = req.body.phone_number;
    let email = req.body.Email;
    let password = req.body.Password;

    let conform_password = req.body.Confirm_password;
    if ((password !== conform_password) && (first_Name !== undefined) && (last_Name !== undefined) && (email !== undefined) && (gender !== undefined) && (phone_Number !== undefined) && (password !== undefined) && (conform_password !== undefined)) {
        res.render('./reservation_page/register_error.ejs');
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        var register_Perimum_User_Querry = `INSERT INTO delicious_register_page (first_name, last_name,gender,phone_number, email, password ) values('${first_Name}', '${last_Name}', '${gender}', ${phone_Number},'${email}','${hashedPassword}')`;
        connection.query(register_Perimum_User_Querry, (err, result) => {
            if (err) {
                res.render('./reservation_page/register_error.ejs');
            } else {
                res.render("../register_login_page/login.ejs");
            }
        })
    }
})
// login page 
app.get('/login', (req, res) => {
    res.render('../register_login_page/login.ejs');
})
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});