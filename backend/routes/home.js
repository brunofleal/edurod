const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("up");
});

module.exports = router;
