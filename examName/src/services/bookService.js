const Book = require('../models/Book');
const User = require('../models/User');

exports.create = data => Book.create(data);

exports.getAll = () => Book.find();

exports.getOne = bookId => Book.findById(bookId);

exports.getOneWithWishingList = bookId => Book.findById(bookId).populate('wishingList');

exports.edit = (bookId, data) => Book.findByIdAndUpdate(bookId, data, { runValidators: true });

exports.delete = bookId => Book.findByIdAndDelete(bookId);

exports.wish = async (bookId, wisherId) => {
    const book = await Book.findById(bookId);
    const wisher = await User.findById(wisherId);

    book.wishingList.push(wisher);

    await book.save();
};