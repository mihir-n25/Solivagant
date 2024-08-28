const express = require("express");
const router = express.Router();

router.get("/",(req,res) => {
    res.send("GET for posts");
});
//Show
router.get("/:id",(req,res)=>{
    res.send("Get for posts  id");
});
//Post
router.post("/",(req,res)=>{
    res.send("POST for posts");
});
//Delete
router.delete("/:id",(req,res)=>{
    res.send("Delete for post id");
});

module.exports = router;