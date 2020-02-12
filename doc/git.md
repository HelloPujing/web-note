# prepare
- `git init`
- `git add file.suffix`
- `git commit -m "message"`

# branch
- `git branch` show list
- `git branch branchname`
- `git branch issue1`

# switch branches
- `git checkout branchname`
- `git checkout branchname -b` create and switch branch
- `git checkout issue1`

# merge branches
- `git merge branchname` 把分支合并到当前分支
```
分支合并到master
git checkout master
git merge branchname
```

# 统计
```
git shortlog --numbered --summary --no-merges --since="2019-05-01" // git提交次数
git log --since ==2020-01-01 --until=2017-07-10 | wc -l
git log --since ==2020-02-07 | wc -l
```

- 地方
> git log --author="pujing" --pretty=tformat:  --since ==2020-02-01 --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s,total lines: %s\n", add, subs, loc }'
> git log --pretty=tformat:  --since ==2020-02-01 --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s,total lines: %s\n", add, subs, loc }'
