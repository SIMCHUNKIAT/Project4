const express = require("express");
const router = express.Router();
const contactformController = require("../controllers/contactform_controller");

router.post("/contact", contactformController.sendContactEmail);

module.exports = router;