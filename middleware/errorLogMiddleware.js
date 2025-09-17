const responseWatcher = async (req, res, next) => {
    const oldSend = res.send;

    res.send = function (body) {
        if (res.statusCode !== 200) {
            console.error(`[ERROR] ${req.method} ${req.originalUrl} -> Status: ${res.statusCode}`);
        }
        return oldSend.call(this, body);
    };

    next();
}

const beforeMiddleware = async (req, res, next) => {
    const data = {
        sts: 0,
        msg: 'Error'
    }
    return res.status(401).send({
        ...data
    })
}

module.exports = { responseWatcher, beforeMiddleware }
