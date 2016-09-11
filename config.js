module.exports = {
    'API_KEY':process.env.API_KEY || null,
    'DOMAIN': process.env.DOMAIN || null,
    'DB': process.env.DB || null,
    'EMAIL': {
        'FROM': process.env.EMAIL_FROM || null,
        'TO': process.env.EMAIL_TO || null
    }
};
