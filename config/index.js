module.exports = {
    port: process.env.PORT || 4000,
    session: {
        key: 'resume-builder',
        maxAge: 86400000,
        httpOnly: false
    },
    mongodb: 'mongodb://localhost:27017/1231'
}