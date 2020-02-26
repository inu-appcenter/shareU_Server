const app = require('./config/express')();


// const fileupload = require("express-fileupload");
app.use('/search', require('./routes/search/index'));
app.use('/notice', require('./routes/notice/index'));
app.use('/document', require('./routes/document/index'));
app.use('/account',require('./routes/account/user'))


app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err)
    res.sendStatus(err.status || 500);
});


const port = app.get('key').port;
app.listen(port, () => {
    console.log( 'Listening on port %d.', port);
});
