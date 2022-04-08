const { moviePerPage } = require("../data/options");

const paginate = (page) => {
  const limit = moviePerPage;

  if (!page) page = 1;
  const skip = (page - 1) * limit;
  return { skip, limit };
};

module.exports = paginate;
