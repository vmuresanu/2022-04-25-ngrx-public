const { getJestProjects } = require('@nrwl/jest');

console.log(getJestProjects());
module.exports = {
  projects: getJestProjects(),
};
