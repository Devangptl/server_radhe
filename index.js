const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');

const app = express()
app.use(cors());
app.use(express.json());

  
      // db connection  
  
  const db=mysql.createConnection({
    host: process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
 
  })


  app.use("/check", (req,res)=>{
    res.json({msg:"Hello trial for db"});
  })


  // add student details

  app.post('/radheras/students', (req,res)=>{
    const sql = "INSERT INTO students (`id`,`date`,`name`,`batch`,`image`,`contact`,`address`,`fees`,`paymentmode`,`remarks`,`icard`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    const values = [
      req.body.id,
      req.body.date,
      req.body.name,
      req.body.batch,
      req.body.image,
      req.body.contact,
      req.body.address,
      req.body.fees,
      req.body.paymentmode,
      req.body.remarks,
      req.body.icard,
    ]

    db.query (sql,values, (err,data)=>{
      if(err) return res.json(err);
      return res.json(data);
    })
  })


// add expense detaiils

  app.post('/radheras/expances', (req,res)=>{
    const sql = "INSERT INTO expances (`id`,`details`,`date`,`amount`,`paymentmode`,`through`,`remark`) Values (?,?,?,?,?,?,?)";
    const values = [
      req.body.id,
      req.body.details,
      req.body.date,
      req.body.amount,
      req.body.paymentmode,
      req.body.through,
      req.body.remark,
    ]
    console.log("inside check ")
    db.query (sql, values, (err,data)=>{
      if(err) return res.json(err);
      return res.json(data);
    })
  })


  // print student details on student page
  

  app.get('/api/students',(req,res)=>{
    const sql = "SELECT * FROM students";
    db.query (sql, (err,data)=>{
      if(err) {return res.json(err);}
       res.send(data);
    });
  });


  // print expense details on expense page

  app.get('/api/expances',(req,res)=>{
    const sql = "SELECT * FROM expances";
    db.query (sql, (err,data)=>{
      if(err) {return res.json(err);}
       res.send(data);
    });
  });



  // got student data in to update student form

  app.get('/update/:id', (req,res)=>{
    const sql = "SELECT * FROM students Where id = ?";
    const id = req.params.id;
    db.query (sql,[id], (err,result)=>{
      if(err) return res.json(err);
      return res.json(result);
    })
  })
  



// submit updated student data to database

  app.put('/updatesubmit/:id' ,(req,res) =>{
    const sql = "UPDATE students SET `date`= ?,`name`= ?,`batch`=?,`image`=?,`contact`=?,`address`=?,`fees`=?,`paymentmode`=?,`icard`=?,`remarks`=? WHERE id = ?";
    const id = req.params.id;
   
    db.query(sql,[ req.body.date,req.body.name,req.body.batch,req.body.image,req.body.contact,req.body.address,
      req.body.fees,req.body.paymentmode,req.body.icard,req.body.remarks, id ],(err,result) =>{
      if(err) return res.json(err)
      return res.json({update:true})
    })

  })



  // got expwnse data in to update expense form

  app.get('/getexpence/:id', (req,res)=>{
    const sql = "SELECT * FROM expances Where id = ?";
    const id = req.params.id;
    db.query (sql,[id], (err,result)=>{
      if(err) return res.json(err);
      return res.json(result);
    })
  })


// submit updated expense data in to databse

  app.put('/expancesubmit/:id' ,(req,res) =>{
    const sql = "UPDATE expances SET `details`= ?,`date`= ?,`amount`=?,`paymentmode`=?,`through`=?,`remark`=? WHERE id = ?";
    const id = req.params.id;
   
    db.query(sql,[ req.body.details,req.body.date,req.body.amount,req.body.paymentmode,req.body.through,req.body.remark,  id ],(err,result) =>{
      if(err) return res.json(err)
      return res.json(res)
    })

  })



  // insert image into databse

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Keep the original file name
    },
  });
  
  const upload = multer({ storage });
  
  app.post('/api/uploadimage', upload.single('image'), (req, res) => {
    const imagePath = req.file.path; // Get the path of the uploaded image
    // Save imagePath to MySQL database
    // Insert into your_table (image_path_column) values (imagePath)
    const sql = "INSERT INTO image (imagePath) VALUES (?)";
    
    db.query (sql, imagePath, (err,data)=>{
      if(err) return res.json(err);
      return res.json(data);
    })
    
  });





app.listen(5001, ()=>{
    console.log("Listining...")
  })