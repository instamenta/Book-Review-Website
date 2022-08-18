const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minlength: [2, 'Should be at least 2 characters'],
    },
    author: {
        type: String,
        required: [true, 'Author is required!'],
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
    },
    bookReview: {
        type: String,
        required: [true , 'Book Review is required!']
    },
    stars: {
        type: Number,
        required: [true, 'Stars are required!'],
        min: 1,
        max: 5
    },
    genre: {
        type: String,
        required: [true, 'Genre is required!'],
    },
    wishingList: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;