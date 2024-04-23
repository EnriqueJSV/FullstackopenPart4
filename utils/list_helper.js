const dummy = (blogs) => {
  if (Array.isArray(blogs)) {
    return 1;
  }
};

const totalLikes = (blogs) => {
  if (blogs.length === 1) {
    return blogs[0].likes;
  } else {
    const total = blogs.reduce((sum, element) => sum + element.likes, 0);

    return total;
  }
};

module.exports = {
  dummy,
  totalLikes,
};
