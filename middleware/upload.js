const multer = require('multer');

// Memory storage — file stays in RAM as buffer
// Never written to disk — safe for Render's ephemeral filesystem
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {  // ← exactly 3 params: req, file, cb
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});
module.exports = upload;