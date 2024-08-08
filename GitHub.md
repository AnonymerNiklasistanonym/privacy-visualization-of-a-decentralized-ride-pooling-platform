# GitHub

## Clone Repository SSH

1. Create SSH key locally:

   ```sh
   ssh-keygen -o -t rsa -C “ssh@github.tik.uni-stuttgart.de”
   # No passphrase or special file name necessary
   ```

2. Visit the GitHub website (e.g. `github.tik.uni-stuttgart.de`) and go to `Settings`, `SSH and GPG keys`

3. Click `New SSH key` and insert the public key information to assign it to your account:

   ```sh
   cat /home/$USER/.ssh/id_rsa.pub
   # ssh-rsa ...= “ssh@github.tik.uni-stuttgart.de”
   ```

4. Then just clone the repository:

   ```sh
   git clone git@github.tik.uni-stuttgart.de:$REPO_USER/$REPO_NAME.git
   ```

## Change identity for local repository

In the case the local global user name/email is different than the one you want to sign commits with you can change it for the local git repository:

```sh
git config user.name "FIRST_NAME LAST_NAME"
git config user.email "MY_NAME@example.com"
```

To verify the current identity run:

```sh
cat .git/config
```

## Create, switch and push new `git` branch

```sh
# Create the branch `dev`
git branch dev
# Go to branch `dev`
git switch dev
# Push branch to remote repository
git push -u origin dev
```

## Commit changes

```sh
# Copy/Create files then register them
git add .
# Commit them with a message
git commit -m "Add code"
# Push the changes
git push
```

## Undo commit

```sh
git reset --soft HEAD~
```

## Undo local file changes

```sh
git restore file.tx
```

## Amend current changes to last commit

```sh
# Add changes
git add .
# Modify last commit with these changes (or edit the commit message)
git commit --amend
```

## Force update changes to remote

```sh
git push --force
```

## Reset local repository

```sh
# Reset all tracked files
sudo git reset --hard origin/main
# Remove untracked files
sudo git clean -f -x
# Remove untracked directories
git clean -f -d
```

## See difference in files

```sh
# See difference of current non staged
# > files to staged files
git diff
# > specific file to staged file
git diff file.txt
# See difference of current staged
# > files to the previous commit
git diff --staged
# > specific file to the previous commit
git diff --staged file.txt
```

## Mirror repository

```sh
# Push the whole repository to a remote repository
git push -f git@github.tik.uni-stuttgart.de:$REPO_USER/$REPO_NAME $REPO_BRANCH
```
