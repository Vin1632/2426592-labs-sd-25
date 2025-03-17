const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;
app.use(bodyParser.json());


let nextID = 0;
let books = [];


//returns an object with yout student number
app.get('/whoami', (req, res)=>
{
    res.send({"student number" : 2426592});
});


//returns a list of all books
app.get('/books', (req, res)=> 
{
    res.status(200).send(books);
});


//Returns the details of the book
app.get('/books/:id', (req, res)=>
{
    const id = parseInt(req.params.id);
    const book = books.find((book)=> book.id === id)
    if(!book)
    {
        res.status(404).send('404 Not Found');
    }
    else
    {
        res.status(200).send(books.filter((book_) => book_.id === id));
    }
});

//Adds a new book to the collection
app.post('/books', (req, res)=> 
{
    //handle the IDs to be unique
    const {title, details} = req.body;
    if(title && details) 
    {
        nextID++;
        const newBook = {
            "id" : nextID,
            "title": title,
            "details": [
                {
                    "id": nextID,
                    "author": details[0].author,
                    "genre": details[0].genre,
                    "publicationYear": details[0].publicationYear
                }
            ]
        };

        books.push(newBook);
        res.status(200).send('Book added Successfully');
    }
    else
    {
        res.status(400).send('400 Bad Request');
    }
});

//update an exising book's information
app.put('/books/:id', (req, res)=> 
{
    const id = parseInt(req.params.id);
    const { title, details} = req.body;
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
        res.status(404).send('404 Not Found');
    } else {
        const book = books[bookIndex];
        
        if (title) {
            book.title = title;
        }
        
        if(details)
        {
            book.details = [
                {
                    "id": id,
                    "author": details[0].author,
                    "genre": details[0].genre,
                    "publicationYear": details[0].publicationYear
                }
            ];
            
        }
        
        res.send(`Changes to Book ${book.id} done`);
        
    }

});

//Delete a book from the collection
app.delete('/books/:id', (req, res) =>
{
    const id = parseInt(req.params.id);
    const initialLength = books.length;
    
    books = books.filter((book) => book.id !== id);
    
    if (books.length === initialLength) {
        res.status(404).send('404 Not found');
    } else {
        res.status(200).send(`book deleted successfully`);
    }
});

//Adds Details
app.post('/books/:id/details', (req, res) =>
{
    const id = parseInt(req.params.id);
    const {author, genre, publicationYear} = req.body;
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
        res.status(404).send('404 Not Found');
    }
    else
    {
        const book = books[bookIndex];
        book.details[0].id = id;
        if(author)
        {
            book.details[0].author = author;
        }
        if(genre)
        {
            book.details[0].genre = genre;
        }
        if(publicationYear)
        {
            book.details[0].publicationYear = publicationYear;
        }

        res.status(200).send(`Details for Book  upddates`);
    }
    
});

//removes detail from the book
app.delete('/books/:id/details/:detailsId', (req, res) =>
{
    //This removes ALL the details of the book
    const id = parseInt(req.params.id);
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
        res.status(404).send('404 Not Found');
    }
    else
    {
        const book = books[bookIndex];
        book.details = [];
        res.status(200).send(`deleted some book details`);
    }
});
//Running the app
app.listen(PORT, (error)=>
{
    if(!error)
    {
        console.log(`Running on port http://localhost:${PORT}`);
    }
})