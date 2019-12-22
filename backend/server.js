const express = require('express');
const app = express();
const backend_port = 3223

// app.use(express.static('../public'));
// app.use(express.static(__dirname));

app.get('/customers', (req, res) => {
    const customers = {id: 1, name: 'Johnny'};
    res.json(customers);
    // console.log(customers)
});

console.log("Listening on port", backend_port);
console.log(__dirname);
app.listen(backend_port);
