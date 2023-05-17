const multer =require('multer')
const path=require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Pic/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    },
  });
  
  const upload = multer({ storage: storage });

 module.exports=upload
// module.exports=multer({
//     storage:multer.diskStorage({}),
//     fileFilter:(req,file,cb)=>{
//         let ext= path.extname(file.originalname);
//         if(ext!=='.jpg' && ext!=='.jpeg' && ext!=='.png'){
//             cb(new Error('file is not supported'),false)
//             return;

//         }
//         cb(null,true)
//     }
// })