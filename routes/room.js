/*
 * This file provides all request implementations
 */
const express = require("express");
const router = express.Router();
const getConnection = require("../db.js");

router
  .route("/room")
  .get((req, res) => getAllRooms(req, res));

router
  .route("/addReservation")
  .post((req, res) => insertReservation(req, res));

const getAllRooms = (req, res) => {
  const connection = getConnection();
  let model = {
    additionalservices: undefined,
    reservations: undefined
  };

  // select all additional services
  let queryString = "SELECT * FROM additionalservice";
  connection.query(queryString, (err, results, fields) => {
    if (err) {
      console.log(`Failed DB proccess '${queryString}' - ` + err);
      res.sendStatus(500);
      return;
    }
    console.log("Results", results);
    model.additionalservices = results;

    // select all resercations
    queryString = "SELECT * FROM reservation";
    connection.query(queryString, (err, results, fields) => {
      if (err) {
        console.log(`Failed DB proccess '${queryString}' - ` + err);
        res.sendStatus(500);
        return;
      }
      model.reservations = results;
      console.log("Results", results);
      res.json(model);
    });
  });
};

const insertReservation = (req, res) => {
  const connection = getConnection();
  console.log("Request body", req.body);
  let reservation = {
    id: undefined,
    email: req.body.email,
    startdate: new Date(Date.parse(req.body.startdate)),
    enddate: new Date(Date.parse(req.body.enddate))
  };

  // add given reservation
  let queryString = "INSERT INTO reservation (email, startdate, enddate) VALUES (?, ?, ?)";
  connection.query(
    queryString,
    [reservation.email, reservation.startdate, reservation.enddate],
    (err, results, fields) => {
      if (err) {
        console.log(`Failed DB proccess '${queryString}' - ` + err);
        res.sendStatus(500);
        return;
      }
      console.log("Inserted a new reservation with id: ", results.insertId);
      reservation.id = results.insertId;

      // iterate over all selected additionalservices and add them to the DB
      if(req.body.additionalservices !== undefined){
        req.body.additionalservices.map(additionalservice => {
          console.log("additionalservice id: ", additionalservice);
          queryString = "INSERT INTO reservation_service (reservation_id, service_id) VALUES (?, ?)";
          connection.query(
            queryString,
            [reservation.id, additionalservice],
            (err, results, fields) => {
              if (err) {
                console.log(`Failed DB proccess '${queryString}' - ` + err);
                res.sendStatus(500);
                return;
              }
              console.log("Inserted a new reservation_service with id: ", results.insertId);
            }
          );
        });
      } 
      res.json({});
    }
  );
};

module.exports = router;