const Book = require('../models/Book');
const User = require('../models/User');

exports.create = data => Book.create(data);

exports.getAll = () => Book.find();

exports.getOne = bookId => Book.findById(bookId);

exports.getOneWithBuyers = bookId => Book.findById(bookId).populate('buyAbook');

exports.edit = (bookId, data) => Book.findByIdAndUpdate(bookId, data, { runValidators: true });

exports.delete = bookId => Book.findByIdAndDelete(bookId);

exports.buy = async (bookId, buyerId) => {
    const book = await Book.findById(bookId);
    const buyer = await User.findById(buyerId);

    book.buyAbook.push(buyer);

    await book.save();
};