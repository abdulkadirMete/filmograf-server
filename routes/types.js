const router = require("express").Router();
const Type = require("../models/Type");
const mongoose = require("mongoose");
const paginate = require("../helpers/paginate");
const Movie = require("../models/Movie");
const errorWrapper = require("../helpers/errorWrapper");

// get all types
router.get(
  "/",
  errorWrapper(async (req, res, next) => {
    const types = await Type.find().sort({ title: 1 });
    res.status(200).json(types);
  })
);

//get movies for this type
router.get(
  "/:id/:page?",
  errorWrapper(async (req, res, next) => {
    const _id = req.params.id;
    const { skip, limit } = paginate(req.params.page);
    const type = await Type.findById(_id);
    const movies = await Movie.find({ type: type.title })
      .select(["name", "img", "release", "imdb"])
      .skip(skip)
      .limit(limit);

    res.status(200).json({ movies });
  })
);

module.exports = router;
