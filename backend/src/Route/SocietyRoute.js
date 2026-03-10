const express = require("express");
const {
createSociety,
getSocieties,
getSociety
} = require("../Controller/SocietyController");

const router = express.Router();


// CREATE

router.post("/society",createSociety);


// GET ALL

router.get("/society",getSocieties);


// GET SINGLE

router.get("/society/:id",getSociety);

// UPDATE
router.put("/society/:id",(req,res)=>{
  res.send("Update society");
}   );

// DELETE
router.delete("/society/:id",(req,res)=>{
  res.send("Delete society");
}   );


 module.exports = router;