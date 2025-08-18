const express = require("express");
const router = express.Router();
const { getCompanyInfo, updateCompanyInfo } = require("../controllers/companyController");

// GET : infos entreprise
router.get("/", getCompanyInfo);

// PUT : mise à jour infos entreprise
router.put("/", updateCompanyInfo);

module.exports = router;