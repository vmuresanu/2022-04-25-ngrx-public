set -e

git checkout master

branches=(master solution-01-01-1-holidays solution-01-01-2-customers solution-02-01-customers-api solution-02-02-repository solution-02-03-view-model solution-03-01-1-cache-holidays)
previous=
current=

for branch in ${branches[*]}; do
  previous=$current
  current=$next
  next=$branch

  if [ ! $current = "" ]
  then
    git checkout $current
    git tag -d `git tag | grep -E '.'`
    git merge $previous -m merge
  fi;
done

git checkout $branch
git merge $current $branch -m merge

git checkout master
