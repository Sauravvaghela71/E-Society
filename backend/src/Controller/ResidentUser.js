const user = [{name : "saurav",age:21,city:"deesa"},
    {name : "rahul",age:22,city:"harij"}

]

const Resident = (req,res)=>{
   res.json({
    massage : "user fpund",
    data : user
   });
}
module.exports = {Resident}