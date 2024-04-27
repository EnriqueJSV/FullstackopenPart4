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

const favoriteBlog = (blogs) => {
  const highest = blogs.reduce((fav, element) => {
    if (fav < element.likes) {
      return (fav = element.likes);
    }
    return fav;
  }, 0);

  const newArray = blogs.reduce(
    (array, element) => array.concat(element.likes),
    []
  );

  const getIndex = newArray.indexOf(highest);

  const favorite = {
    title: blogs[getIndex].title,
    author: blogs[getIndex].author,
    likes: blogs[getIndex].likes,
  };

  return favorite;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
