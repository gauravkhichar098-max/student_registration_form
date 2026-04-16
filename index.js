const express=require("express");
const multer=require("multer");
const storage=multer.diskStorage(
    {
        destination:function(req,file,cb)
        {
            cb(null,'./public/images/');
        },
        filename:function(req,file,cb)
        {
            cb(null,file.originalname);
        }
    }
)
const upload=multer({storage:storage});
const {Pool}=require("pg");
const pool=new Pool(
    {
        host:"localhost",
        user:"postgres",
        password:"IECS",
        database:"Registration Form",
        port:5432
    }
)
const bodyParser=require("body-parser");
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",(req,res)=>
{
    
});
app.post("/form",upload.single("file"),(req,res)=>
{
    let file=req.file.originalname;
    let{reno,snm,bch,sed,adr}=req.body;
    async function connectDB()
    {
        try {
                await pool.connect();
                console.log("Connected");
                const qry="insert into Registered_details values('"+reno+"','"+snm+"','"+bch+"','"+sed+"','"+file+"','"+adr+"')";
                const result=await pool.query(qry);
                console.log("data stored",result.rows);
                res.redirect("index.html");
        } catch (error) {
                console.error("Disconnected",error);
        }
    }
    connectDB()
});
const PORT = process.env.PORT || 4567;
app.listen(PORT, () => {
    console.log("server running");
});