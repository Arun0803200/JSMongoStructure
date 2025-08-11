const express = require("express");
const router = express.Router();

// Module Group Routes
const {
    createModuleGroup,
    getModuleGroup
} = require('../controllers/Module_Group_Controller');

router.post('/module-group', createModuleGroup);
router.get('/module-group', getModuleGroup);

// Admin role routes
const {
    createAdminRole,
    getAdminRoleList,
    getAdminRoleDetail,
    updateAdminRole,
    deleteAdminRole,
    deleteMultipleAdminRoles,
} = require('../controllers/AdminRoleController');
router.post('/role', createAdminRole);
router.get('/role', getAdminRoleList);
router.get('/role/:id', getAdminRoleDetail);
router.put('/role/:id', updateAdminRole);
router.delete('/role/:id', deleteAdminRole);
router.post('/role/delete', deleteMultipleAdminRoles)

module.exports = router;