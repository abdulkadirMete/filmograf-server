const router = require("express").Router();
const errorWrapper = require("../helpers/errorWrapper");
const verifyUser = require("../middlewares/auth/verifyUser");
const Rate = require("../models/Rate");
const Comment = require("../models/Comment");
const Movie = require("../models/Movie");
const { lastCommentsLimit } = require("../data/options");

//  insert or update rate
router.put(
  "/rate",
  errorWrapper(async (req, res, next) => {
    const { rate, userId, movieId } = req.body;
    const updateFeedback = await Rate.updateOne(
      { movie: movieId, user: userId },
      { movie: movieId, rate: rate, user: userId },
      { upsert: true }
    );

    res.status(200).json(updateFeedback);
  })
);

// get rate
router.post(
  "/rate",
  errorWrapper(async (req, res, next) => {
    const { userId, movieId } = req.body;
    const rateObject = await Rate.findOne({ movie: movieId, user: userId });
    res.status(200).json(rateObject);
  })
);

//  put comment
router.put(
  "/comment",
  verifyUser,
  errorWrapper(async (req, res, next) => {
    const { comment, user, movie } = req.body;
    const commentObject = new Comment({
      user: user,
      movie: movie,
      comment: comment,
    });
    await Movie.findByIdAndUpdate(
      movie,
      { $push: { comments: commentObject } },
      { new: true }
    );
    const savedComment = await commentObject.save().then((item) =>
      item.populate({
        path: "user",
        select: "username img ",
      })
    );

    res.status(200).json(savedComment);
  })
);
// get comments
router.post(
  "/comment",
  errorWrapper(async (req, res, next) => {
    const comments = await Comment.find({ movie: req.body.movieId })
      .sort({ createdAt: "desc" })
      .populate({
        path: "user",
        select: "username img ",
      });
    res.status(200).json(comments);
  })
);

// delete comment
router.delete(
  "/comment",
  verifyUser,
  errorWrapper(async (req, res, next) => {
    const { commentId, userId } = req.body;
    if (userId === req.user.id || req.user.isAdmin) {
      await Comment.deleteOne({ _id: commentId });
      res.status(200).json("Yorum silindi!!");
    } else {
      res.status(401).json("Bir hata oluştu daha sonra tekrar deneyin");
    }
  })
);

// get last comments
router.get(
  "/comment/last",
  errorWrapper(async (req, res, next) => {
    const lastComments = await Comment.find()
      .limit(lastCommentsLimit)
      .sort({ createdAt: "desc" })
      .populate({
        path: "user",
        select: "username img ",
      })
      .populate({
        path: "movie",
        select: "name img ",
      });
    res.status(200).json(lastComments);
  })
);

module.exports = router;
