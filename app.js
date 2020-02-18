const app = require('./config/express')();


const fileupload = require("express-fileupload");
app.use('/search', require('./routes/search/index'));
app.use('/notice', require('./routes/notice/index'));
app.use('/document', require('./routes/document/index'));




app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(`Error handler: ${req.originalUrl} ${err}`);
    res.sendStatus(err.status || 500);
});

const port = app.get('key').port;
app.listen(port, () => {
    console.log( 'Listening on port %d.', port);
});
