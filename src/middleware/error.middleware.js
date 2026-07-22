const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

};

export default errorHandler;

// const errorHandler = (err, req, res, next) => {
//     console.log("========= ERROR =========");
//     console.error(err);
//     console.error(err.stack);
//     console.log("=========================");

//     res.status(err.statusCode || 500).json({
//         success: false,
//         message: err.message || "Internal Server Error",
//     });
// };

// export default errorHandler;