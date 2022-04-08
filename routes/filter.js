const router = require("express").Router();
const Movie = require("../models/Movie");
const paginate = require("../helpers/paginate");
const errorWrapper = require("../helpers/errorWrapper");
const Type = require("../models/Type");

router.get(
  "/robot/:page",
  errorWrapper(async (req, res, next) => {
    // paginate
    const page = req.params.page;
    const { skip, limit } = paginate(page);

    // create query}
    let query = {};
    let movies = [];
    const { type, release, imdb } = req.query;

    if (release) query.release = release;

    if (type) {
      const typeObject = await Type.findById(type);
      query.type = typeObject?.title;
    }

    if (imdb) {
      movies = await Movie.find({ ...query, imdb: { $gte: parseFloat(imdb) } })
        .select(["name", "img", "release", "imdb"])
        .limit(limit)
        .skip(skip)
        .sort({ imdb: -1, _id: 1 });
    } else {
      movies = await Movie.find(query)
        .limit(limit)
        .skip(skip)
        .select(["name", "img", "release", "imdb"]);
    }

    res.status(200).json({ movies });
  })
);

// release
router.get(
  "/release/:release/:page",
  errorWrapper(async (req, res, next) => {
    const release = req.params.release;
    const { skip, limit } = paginate(req.params.page);
    const movies = await Movie.find({ release: release })
      .select(["name", "img", "release", "imdb"])
      .skip(skip)
      .limit(limit);

    res.status(200).json({ movies });
  })
);

module.exports = router;
