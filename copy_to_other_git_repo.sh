#!/usr/bin/env bash

GIT_REPO_CODE=$HOME/Documents/GitHubUniStuttgart/bsc-2024-mikeler-code
GIT_REPO_THESIS=$HOME/Documents/GitHubUniStuttgart/bsc-2024-mikeler-thesis

# Copy all non directory files
cp ./* "$GIT_REPO_CODE/"
cp ./* "$GIT_REPO_THESIS/"
cp ./.* "$GIT_REPO_CODE/"
cp ./.* "$GIT_REPO_THESIS/"
# > Remove unwanted files
rm "$GIT_REPO_CODE/copy_to_other_git_repo.sh" "$GIT_REPO_THESIS/copy_to_other_git_repo.sh"
rm "$GIT_REPO_CODE/update_file_other_git_repo.py" "$GIT_REPO_THESIS/update_file_other_git_repo.py"
rm "$GIT_REPO_THESIS/compose.yaml"

# Copy .github workflows
rm -rf "$GIT_REPO_CODE/.github" "$GIT_REPO_THESIS/.github"
cp -a ./.github "$GIT_REPO_CODE/.github"
cp -a ./.github "$GIT_REPO_THESIS/.github"
# > Remove unwanted files
rm "$GIT_REPO_CODE/.github/workflows/latex.yml"
rm "$GIT_REPO_THESIS/.github/workflows/nodejs.yml"

# Copy global files
rm -rf "$GIT_REPO_CODE/globals" "$GIT_REPO_THESIS/globals"
cp -a ./globals "$GIT_REPO_CODE/globals"
cp -a ./globals "$GIT_REPO_THESIS/globals"
# > Remove unwanted files
rm -rf "$GIT_REPO_CODE/globals/latex"
rm -rf "$GIT_REPO_THESIS/globals/typescript"
rm "$GIT_REPO_THESIS/globals/copy.ps1"

# Copy thesis related files
rm -rf "$GIT_REPO_THESIS/bibliography" "$GIT_REPO_THESIS/spelling" "$GIT_REPO_THESIS/thesis"
cp -a ./bibliography "$GIT_REPO_THESIS/bibliography"
cp -a ./spelling "$GIT_REPO_THESIS/spelling"
cp -a ./thesis "$GIT_REPO_THESIS/thesis"

# Copy code related files
rm -rf "$GIT_REPO_CODE/images" "$GIT_REPO_CODE/pathfinder" "$GIT_REPO_CODE/simulation" "$GIT_REPO_CODE/visualization"
cp -a ./images "$GIT_REPO_CODE/images"
cp -a ./pathfinder "$GIT_REPO_CODE/pathfinder"
cp -a ./simulation "$GIT_REPO_CODE/simulation"
cp -a ./visualization "$GIT_REPO_CODE/visualization"

# Special file updates:
python -m update_file_other_git_repo --file "$GIT_REPO_CODE/Makefile" --type Makefile --name "Student Project Description" Thesis
python -m update_file_other_git_repo --file "$GIT_REPO_THESIS/Makefile" --type Makefile --name "Student Project Description" Code
python -m update_file_other_git_repo --file "$GIT_REPO_CODE/README.md" --type md --name "Student Project Description" Thesis Personal
python -m update_file_other_git_repo --file "$GIT_REPO_THESIS/README.md" --type md --name "Student Project Description" Code Personal
