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
        connectionString: process.env.DATABASE_URL,
        ssl: {rejectUnauthorized: false}
    }
)
const bodyParser=require("body-parser");
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",(req,res)=>
{
    res.sendFile(__dirname + "/public/index.html");   
});
app.post("/form", upload.single("file"), async (req, res) => {
    try {
      let file = req.file.originalname;
      let { reno, snm, bch, sed, adr } = req.body;
  
      const qry = `
        INSERT INTO Registered_details 
        (rollno, name, branch, section, file, address)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
  
      await pool.query(qry, [reno, snm, bch, sed, file, adr]);
  
      console.log("Data stored");
      res.redirect("index.html");
  
    } catch (error) {
      console.error("Error:", error);
      res.send("Error occurred");
    }
  });
const PORT = process.env.PORT || 4567;
app.listen(PORT, () => {
    console.log("server running");
});