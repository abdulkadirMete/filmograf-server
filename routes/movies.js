const router = require("express").Router();
const Movie = require("../models/Movie");
const paginate = require("../helpers/paginate");
const errorWrapper = require("../helpers/errorWrapper");
const Rate = require("../models/Rate");
const { default: mongoose } = require("mongoose");
const { sliderItemLimit, searchItemLimit } = require("../data/options");

// get page
router.get(
  "/:page",
  errorWrapper(async (req, res, next) => {
    let page = req.params.page;
    const { skip, limit } = paginate(page);
    const movieTotal = await Movie.estimatedDocumentCount();

    const movies = await Movie.find({})
      .select(["name", "img", "release", "imdb"])
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .skip(skip);
    res.status(200).json({ count: movieTotal, movies });
  })
);

// get single movie
router.get(
  "/movie/:id",
  errorWrapper(async (req, res, next) => {
    const movie = await Movie.findOne({ _id: req.params.id }).populate({
      path: "desc",
      select: "desc",
    });
    !movie &&
      res.status(400).json({
        success: false,
        message: "Bu id'ye sahip herhangi bir film bulunamadı!",
      });
    res.status(200).json(movie);
  })
);

//search movie
router.get(
  "/filter/search/",
  errorWrapper(async (req, res, next) => {
    const searchPhrase = new RegExp("^" + req.query.phrase.toLowerCase(), "i");
    const movies = await Movie.find({
      name: { $regex: searchPhrase },
    })
      .select(["name", "img", "release", "imdb"])
      .limit(searchItemLimit);
    res.status(200).json({ movies });
  })
);

// get slider movies
router.get(
  "/showcase/slider",
  errorWrapper(async (req, res, next) => {
    const movies = await Movie.find()
      .limit(sliderItemLimit)
      .select(["name", "img", "release"])
      .sort({ imdb: -1 });

    res.status(200).json({ movies });
  })
);

// get random movie id
router.get(
  "/pick/random",
  errorWrapper(async (req, res, next) => {
    const id = await Movie.aggregate([
      {
        $project: {
          _id: 1,
        },
      },
      { $sample: { size: 1 } },
    ]);
    res.status(200).json(id[0]._id);
  })
);

// increase to movie view count
router.get(
  "/movie/view/:id",
  errorWrapper(async (req, res, next) => {
    await Movie.findByIdAndUpdate(req.params.id, { $inc: { view: 1 } });
    res.status(200).json({ success: true });
  })
);

// update
router.get(
  "/movie/rate/:id",
  errorWrapper(async (req, res, next) => {
    const movieRate = await Rate.aggregate([
      {
        $match: { movie: mongoose.Types.ObjectId(req.params.id) },
      },
      { $group: { _id: null, avarageRate: { $avg: "$rate" } } },
    ]);

    if (movieRate[0]) {
      const roundedRate = movieRate[0].avarageRate.toFixed(1);
      res.status(200).json(roundedRate);
    } else {
      res.status(200).json(null);
    }
  })
);

// get popular
router.get(
  "/popular/:page",
  errorWrapper(async (req, res, next) => {
    let page = req.params.page;
    const { skip, limit } = paginate(page);
    const movieTotal = await Movie.estimatedDocumentCount();
    const movies = await Movie.find()
      .sort({ view: -1, imdb: -1 })
      .select(["name", "img", "release", "imdb"])
      .skip(skip)
      .limit(limit);
    res.status(200).json({ count: movieTotal, movies });
  })
);

module.exports = router;
