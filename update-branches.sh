set -e

git checkout master

branches=(master solution-01-01-01-holidays solution-01-01-02-customers solution-02-01-customers-api solution-02-02-repository solution-02-03-view-model solution-03-01-01-cache-holidays solution-03-01-02-cache-customers solution-03-02-error-handling solution-03-03-deferred-actions solution-03-04-dependent-feature-states solution-04-01-01-unit-tests-holidays solution-04-01-02-unit-tests-customers solution-04-02-01-integration-tests-holidays solution-04-02-02-integration-tests-customers solution-05-01-01-immer-holidays solution-05-01-02-immer-customers solution-05-02-local-storage solution-05-03-01-ngrx-wieder-holidays solution-05-03-02-ngrx-wieder-customers solution-05-04-optimistic-update)
previous=
current=

for branch in ${branches[*]}; do
  previous=$current
  current=$next
  next=$branch

  if [ ! $current = "" ]; then
    git checkout $current
    git tag -d $(git tag | grep -E '.')
    git merge $previous -m merge
  fi
done

git checkout $branch
git merge $current $branch -m merge

git checkout master
