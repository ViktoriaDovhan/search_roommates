const express = require('express');
const {
    getPublicListings,
    getAdminListings,
    createListing,
    updateListing,
    deleteListing,
    toggleListingActive,
} = require('../controllers/listingsController');

const { getUsers } = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getPublicListings);

router.get('/admin/all', requireAdmin, getAdminListings);
router.get('/admin/users/all', requireAdmin, getUsers);
router.patch('/admin/:id/toggle-active', requireAdmin, toggleListingActive);

router.post('/', requireAuth, createListing);
router.put('/:id', requireAuth, updateListing);
router.delete('/:id', requireAuth, deleteListing);

module.exports = router;