const CustomError = require("../../helpers/customError");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  let customError = new CustomError(err.message, err.status);

  if (err.name === "ValidationError") {
    customError = new CustomError(err.message, 400);
  }
  if (err.name === "CastError") {
    customError = new CustomError(err.message, 400);
  }
  if (err.name === "MongoNetworkError") {
    customError = new CustomError(
      "Veritabanı bağlantısı ile ilgili bir sorun oluştu lütfen daha sonra tekrar deneyin!!",
      500
    );
  }
  if (err.code === 11000) {
    console.log(err.message);
    customError = new CustomError(
      "Bu Email veya kullanıcı adı ile kayıtlı farklı bir hesap var!!",
      400
    );
  }

  return res.status(customError.status || 500).json({
    status: false,
    message: customError.message || "Bir Server Hatası Oluştu",
  });
};

module.exports = errorHandler;
