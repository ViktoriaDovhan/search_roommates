const express = require('express');
const {
    getPublicListings,
    getAdminListings,
    createListing,
    updateListing,
    deleteListing,
    toggleListingActive,
} = require('../controllers/listingController');

const { getUsers } = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getPublicListings);
router.post('/', requireAuth, createListing);
router.put('/:id', requireAuth, updateListing);
router.delete('/:id', requireAuth, deleteListing);

router.get('/admin/all', requireAdmin, getAdminListings);
router.patch('/admin/:id/toggle-active', requireAdmin, toggleListingActive);
router.get('/admin/users/all', requireAdmin, getUsers);

module.exports = router;