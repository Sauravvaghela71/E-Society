const user = [{name : "saurav",age:21,city:"deesa"},
    {name : "rahul",age:22,city:"harij"}

]

const Resident = (req,res)=>{
   res.json({
    massage : "user found",
    data : user
   });
}
module.exports = {Resident}