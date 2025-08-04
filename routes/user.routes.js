const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

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

const multer = require('multer');
const { route } = require("../app");
const upload = multer();
router.post('/', upload.single)