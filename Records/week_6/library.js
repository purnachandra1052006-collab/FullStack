const express = require('express');

const books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', available: true },
    { id: 2, title: '1984', author: 'George Orwell', available: false },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', available: true }
];

const library = express();

library.get('/',(req,res)=>{
    res.send("Welcome to Digital Library");
});

library.get('/books',(req,res)=>{
    res.json(books)
});

library.get('/books/:id',(req,res)=>{
    const bookId = parseInt(req.params.id);   
    const book = books.find(b => b.id === bookId); 

    if (book) {
        res.json(book);
    }
    else{
        res.status(404).send('The Book is not found')
    }
});

library.get('/availabelbooks', (req, res) => {
    const booknames = books.filter(b => b.available).map(b => b.title);
    res.json({ message: 'The Available Books in Library are:', booknames });
});


library.listen(3000, ()=>{
    console.log("The Library is opened");
});
