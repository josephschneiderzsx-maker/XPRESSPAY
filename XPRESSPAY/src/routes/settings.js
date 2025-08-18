const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingsController");

// Lire les paramètres
router.get("/", getSettings);

// Mettre à jour les paramètres
router.put("/", updateSettings);

module.exports = router;
