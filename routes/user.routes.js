const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const multer = require('multer');
const fs = require('fs');

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
// Constituency Routes - Admin-User
const {
    createConstituency,
    getAllConstituencies,
    getConstituencyById,
    updateConstituency,
    deleteConstituency,
    deleteMultipleConstituencies
} = require('../controllers/ConstituencyController')
router.post('/constituency', createConstituency);
router.get('/constituency', getAllConstituencies);
router.get('/constituency/:id', getConstituencyById);
router.put('/constituency/:id', updateConstituency);
router.delete('/constituency', deleteConstituency);
router.post('/constituency/multi-delete', deleteMultipleConstituencies);

// Role APIs
const {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    deleteMultipleRoles
} = require('../controllers/RoleController');
router.post('/role', createRole);
router.get('/role', getAllRoles);
router.get('/role/:id', getRoleById);
router.put('/role/:id', updateRole);
router.delete('/role', deleteRole);
router.post('/role/multi-delete', deleteMultipleRoles);

module.exports = router;
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // save to "uploads" directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique name
    }
});
const upload = multer({ storage: storage });
const XLSX = require('xlsx');

router.post('/upload', upload.single('file'), (req, res) => {
    try {
        // Multer will give file path in req.file
        const filePath = req.file.path;

        // Read Excel file
        const workbook = XLSX.readFile(filePath);

        // Take the first sheet name
        const sheetName = workbook.SheetNames[0];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // delete the uploaded file
        fs.unlinkSync(filePath);

        res.json({ success: true, data: jsonData });
    } catch (err) {
        console.log(err);

        res.status(500).json({ success: false, error: err.message });
    }
});
