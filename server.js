const express = require('express');
const expressGraphQL = require('express-graphql');
const path = require('path');
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(4000, () => {
    console.log('App is running on port 4000');
});