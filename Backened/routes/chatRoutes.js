const express= require("express");
const {accessChat,fetchChats,createGroupChat,renameGroupChat,removeFromGroup,addToGroup}= require('../controllers/chatController');
const {protect} = require("../middleware/authMiddleware");

const router =express.Router();

// console.log(typeof protect);  // Should print: "function"
// console.log('protect:',protect);
// console.log('accessChat:', accessChat);
router.route('/').post(protect, accessChat);

router.route('/').get(protect,fetchChats);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect,renameGroupChat);
router.route('/groupremove').put(protect,removeFromGroup);
router.route('/groupadd').put(protect,addToGroup);

module.exports=router;