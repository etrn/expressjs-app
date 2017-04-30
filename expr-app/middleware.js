const requestMiddleware = (req, res, next) => {
    const requestId = Math.random()*100;
    req.id = requestId;

    next();
};

module.exports = {
    requestMiddleware: requestMiddleware
};