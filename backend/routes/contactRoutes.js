const express = require("express");

const router = express.Router();

const {
    createContact,
    getContacts,
    deleteContact
} = require("../controllers/contactController");


// POST q       ` S
router.post("/", createContact);


// GET
router.get("/", getContacts);


// DELETE
router.delete("/:id", deleteContact);


module.exports = router;