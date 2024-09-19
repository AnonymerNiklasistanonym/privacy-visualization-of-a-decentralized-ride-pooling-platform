# Privacy-Visualization of a Decentralized Ride-Pooling Platform

> [!NOTE]
> This is a history filtered repository (to exclude sensitive data) meaning some commits are missing or their titles/descriptions make no sense.
> Overall this was done to preserve some context of certain code parts instead of just squashing all changes into a single commit.

- [Build](#build)
- [Run](#run)

## Build

Manual:

```sh
make build_simulation build_visualization
```

Docker images: (Start docker before running this command [e.g. `systemctl start docker`])

```sh
make docker_simulation
make docker_visualization
```

## Run

> Visit http://localhost:3000/ [visualization] (and http://localhost:3020/ [simulation])

Manual: (Open a terminal for each command)

```sh
make simulation
make visualization
```

Docker: (Start docker before running this command [e.g. `systemctl start docker`])

```sh
make docker
```

## Docker

1. [Install Docker](https://docs.docker.com/get-docker/) and start the docker daemon
   - Linux:
     1. Install (e.g. via `sudo pacman -S docker docker-compose`)
     2. Use `systemd` to start the service: `systemctl start docker`
     3. If it's not yet working create the docker group (if it does not exist): `sudo groupadd docker`
     4. Add your user to this group: `sudo usermod -aG docker $USER`
     5. Log in to the new docker group since the current shells may not yet "know" about being added to the docker group (alternatively run `newgrp docker`)
   - Windows:
     1. Install (e.g. via `winget install -e --id Docker.DockerDesktop`)
     2. Add the binaries to the PATH: `C:\Program Files\Docker\Docker\resources\bin`
     3. Start `Docker Desktop` to start the docker engine
2. Start multiple container/services declared in a `compose.up` file in the current directory: `docker compose up`
   - `docker compose up [OPTIONS] [SERVICE...]`
   - To update the containers after local changes run `docker compose up --build`
   - Windows: In case there are line endings errors from copying files into a docker container you can convert all relevant files to the Linux line endings via e.g. `find . -type f -name '*.tsx' -not -path '*/node_modules/*' -exec dos2unix {} +`

You can view:

- the currently running containers and their IDs/ports/states with `docker ps`
- stop a running container with `docker stop $ID` (stop all of them via `docker ps -aq | xargs docker stop`)

If you are finished you can:

- stop the docker service: `systemctl stop docker`
- prune all docker caches: `docker system prune -a`

## Linux/WSL

The following section contains what packages are used to run all scripts in the repository.

**WSL** (Windows Subsystem for Linux):

- Using WSL you can use all of these commands even on Windows.
- Tested WSL distributions:
  1. `ubuntu` from the [Windows Store](https://apps.microsoft.com/store/detail/ubuntu-on-windows/9NBLGGH4MSV6)
     - Run once `apt update && apt upgrade -y` to update your system
     - Run the following commands to free up space later:
       - Purge orphaned packages: `sudo apt autoremove`
       - Purge removed packages: `sudo apt-get purge $(dpkg -l | grep '^rc' | awk '{print $2}')`
  2. `arch` from a [GitHub repository](https://github.com/yuk7/ArchWSL)
     - Run once `pacman -Sy archlinux-keyring && pacman -Syu` to update your system
     - Run the following commands to free up space later:
       - Purge all cached packages besides the latest version: `paccache -rk1` (`sudo pacman -S pacman-contrib`)
- When opening the terminal (for example Powershell) run the command `ubuntu run`/`arch run` to end up in the exact same directory but in the specified WSL environment
- To exit and get back to the terminal enter `exit`
- You can always reset a WSL distribution to factory settings using the *Advanced Options* button in the Windows settings

### Pacman

- Packages to install (`pacman -S PACKAGE` or when `make` is installed `make installNecessaryPackagesPacman`):<!-- Code -->
  - `docker` (1:27.1.1-1)
  - `docker-compose` (2.29.1-1) <!-- Other -->
  - `inkscape` (1.3.2-8)
  - `make` (4.4.1-2) <!-- Code -->
  - `nodejs` (22.5.1-1)
  - `npm` (10.8.2-1) <!-- Other -->
  - `python` (3.12.4-1) <!-- Code -->
  - `yay` (12.3.5-1) <!-- <Code -->

- AUR Packages to install (`yay -S PACKAGE` or when `make` is installed `make installNecessaryPackagesYay`): <!-- Code> -->
  - `powershell-bin` (7.4.4-1) <!-- <Code -->