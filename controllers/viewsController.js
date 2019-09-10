//180
exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours'
  });
};

//180
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
};
