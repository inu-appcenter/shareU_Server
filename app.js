const app = require('./config/express')();



app.use('/search', require('./routes/search/index'));
app.use('/notice', require('./routes/notice/index'));
app.use('/document', require('./routes/document/index'));
app.use('/account',require('./routes/account/user')) // <-- err



app.use((req, res, next) => {
    
    console.log("WTF????????");
    res.sendStatus(404);
});

app.use((err, req, res, next) => {
    console.log(err)
    res.sendStatus(err.status || 500);
});


const port = app.get('key').port;
app.listen(port, (error) => {
    if (error) return console.log('listen: ',error);
    
    console.log( 'Listening on port %d.', port);
});
