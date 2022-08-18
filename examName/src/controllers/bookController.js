const router = require('express').Router();
const bookService = require('../services/bookService');

const { isAuthenticated } = require('../middlewares/authMid');
const { getErrorMessage } = require('../util');

router.get('/', async (req, res) => {
    try {
        const books = await bookService.getAll().lean();

        res.render('book/catalog', { books });
    } catch (error) {
        res.render('home/404');
    }
});

router.get('/:bookId', async (req, res) => {

    try {
        const book = await bookService.getOne(req.params.bookId).lean();
        if(!book) {
            throw {
                message: 'Invalid ID'
            } 
        }
        const isOwner = book.owner._id == req.user?._id;
        console.log("Is owner: ", isOwner)
        const wished = await hasWished(req.params.bookId, req.user?._id);
        console.log('wished : ', wished);
        console.log(book)
        res.render('book/details', { ...book, isOwner, wished });
    } catch (error) {
        console.log(error);
        res.render('home/404');
    }
});

router.get('/create', isAuthenticated, (req, res) => {
    res.render('book/create');
});

router.post('/create', isAuthenticated, async (req, res) => {
    try {
        let { title, author, genre, stars, image, bookReview} = req.body
        
        let imageState = false
        imageState = image.startsWith('http://')
        imageState = image.startsWith('https://')
        stars = Number(stars)
        if (title.legth < 2) {
            throw {
                message: 'Title must be at least 2 characters long'
            }
        }
        if (author.legth < 5) {
            throw {
                message: 'Author must be at least 5 characters long'
            }
        }
        if (genre.legth < 3) {
            throw {
                message: 'Genre must be at least 3 characters long'
            }
        }
        if (stars < 0 || stars > 5) {
            throw {
                message: 'Stars must be a positive number between 1 - 5'
            }
        }
        if (imageState==false) {
            throw {
                message: 'Image must start with http:// or https://'
            }
        }
        if (bookReview.length < 10) {
            throw {
                message: 'Review must be at least 10 characters long'
            }
        }
        await bookService.create({ ...req.body, owner: req.user._id });

        res.redirect('/books');
    } catch (error) {
        res.render('book/create', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/edit/:bookId', isAuthenticated, async (req, res) => {
    try {
        const book = await bookService.getOne(req.params.bookId).lean();

        res.render('book/edit', { ...book });
    } catch (error) {
        res.render('book/edit', { error: getErrorMessage(error) });
    }
});

router.post('/edit/:bookId', isAuthenticated, async (req, res) => {
    const book = await bookService.getOne(req.params.bookId).lean();

    try {
        const isOwner = book.owner._id == req.user?._id;
        if (!isOwner) {
            throw {
                message: 'Not an owner!',
            };
        }

        await bookService.edit(req.params.bookId, req.body);

        res.redirect(`/book/details/${book._id}`);
    } catch (error) {
        res.render('book/edit', { ...book, error: getErrorMessage(error) });
    }
});

router.get('/delete/:bookId', isAuthenticated, async (req, res) => {
    const book = await bookService.getOne(req.params.bookId).lean();
    console.log('okay')
    try {
        const isOwner = book.owner._id == req.user?._id;
        if (!isOwner) {
            throw {
                message: 'Not an owner!',
            };
        }

        await bookService.delete(req.params.bookId);

        res.redirect('/books');
    } catch (error) {
        console.log(error);
        res.render('home/404');
    }
});

router.get('/wish/:bookId', isAuthenticated, async (req, res) => {
    const book = await bookService.getOneWithWishingList(req.params.bookId).lean();
    try {
        const isOwner = book.owner._id == req.user?._id;

        if (isOwner) {
            throw {
                message: 'Cannot wish if owner!!',
            };
        }

        await bookService.wish(book._id, req.user._id);

        res.redirect(`/book/details/${book._id}`);
    } catch (error) {
        res.render('home/404');
    }
});

const hasWished = async (bookId, userId) => {
     const book = await bookService.getOne(bookId);

    return book.wishingList.includes(userId);
 };

module.exports = router;