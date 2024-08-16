const AppError = require("./AppError");

module.exports = func => {
    return (req, res, next) => {
      func(req, res, next).catch (err => {
        if (err instanceof AppError){
          res.status(err.statusCode).json({ error: err.toString() })
          console.log("bbbbbbbbbbbbbb");
        }
        else
          console.log("aaaaaaa");
          res.status(400).json({ error: err.toString() });
      });
    }
}