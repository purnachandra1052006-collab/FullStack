const express = require('express');

const ex = express();
ex.get("/" , (req , res)=>{
    res.send("Hello World!");
})

ex.listen(10000, () => {
    console.log('Server running on http://localhost:10000');
    
});