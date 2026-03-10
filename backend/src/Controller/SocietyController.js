const Society = require("../Model/SocietyModel");


// CREATE SOCIETY

module.exports.createSociety = async(req,res)=>{

  try{

    const society = new Society(req.body);

    const savedSociety = await society.save();

    res.status(201).json(savedSociety);

  }catch(err){

    res.status(500).json({
      message:"Error creating society",
      error:err.message
    });

  }

};



// GET ALL SOCIETY

module.exports.getSocieties = async(req,res)=>{

  try{

    const societies = await Society.find();

    res.json(societies);

  }catch(err){

    res.status(500).json({
      message:"Error fetching societies"
    });

  }

};



// GET SINGLE SOCIETY

module.exports.getSociety = async(req,res)=>{

  try{

    const society = await Society.findById(req.params.id);

    res.json(society);

  }catch(err){

    res.status(500).json({
      message:"Error fetching society"
    });

  }

};