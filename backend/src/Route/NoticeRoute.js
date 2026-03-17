const express = require("express");
const router = express.Router();
const noticeController = require("../Controller/NoticeController");

// Main routes for /api/notices
router.route("/")
    .post(noticeController.createNotice)
    .get(noticeController.getAllNotices);

// ID specific routes for /api/notices/:id
router.route("/:id")
    .get(noticeController.getNoticeById)
    .put(noticeController.updateNotice)
    .delete(noticeController.deleteNotice);

module.exports = router;