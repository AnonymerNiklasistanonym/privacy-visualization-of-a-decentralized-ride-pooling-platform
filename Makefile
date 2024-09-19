.PHONY: clean format
# Code
.PHONY: build_simulation build_visualization simulation visualization docker_simulation docker_visualization
.PHONY: build_libs docker_libs
.PHONY: docker
.PHONY: createCopyImages lintFix
# Other
.PHONY: installNecessaryPackagesPacman installNecessaryPackagesPacmanAur installNecessaryPackagesUbuntu installNecessaryPythonPackages

# Code
NECESSARY_PACKAGES_PACMAN = make nodejs npm docker docker-compose python yay inkscape

# Code
NECESSARY_PACKAGES_PACMAN_AUR = powershell-bin

NECESSARY_PACKAGES_UBUNTU_WSL = make nodejs npm inkscape

NECESSARY_PACKAGES_PYTHON =

PYTHON?=python

# Code
SIMULATION_DIR=simulation
VISUALIZATION_DIR=visualization
GLOBALS_DIR_LIBS=globals
DOCKER?=docker

all: build_simulation build_visualization

clean:
	# Code
	rm -rf $(SIMULATION_DIR)/node_modules
	rm -rf $(SIMULATION_DIR)/build $(SIMULATION_DIR)/cache $(SIMULATION_DIR)/dist $(SIMULATION_DIR)/docs $(SIMULATION_DIR)/logs
	rm -rf $(VISUALIZATION_DIR)/node_modules $(VISUALIZATION_DIR)/.next
	$(foreach GLOBAL_LIB_DIR, $(wildcard $(GLOBALS_DIR_LIBS)/lib_*), rm -rf "$(CURDIR)/$(GLOBAL_LIB_DIR)/dist"; \
	  rm -rf "$(CURDIR)/$(GLOBAL_LIB_DIR)/node_modules";)

# Code

build_simulation: build_libs
	cd $(SIMULATION_DIR); \
	npm ci; \
	npm run build

simulation: build_simulation
	cd $(SIMULATION_DIR); \
	npm run start

docker_simulation: docker_libs
	cd $(SIMULATION_DIR); \
	docker build --tag nextjs-docker .

build_visualization: build_libs
	cd $(VISUALIZATION_DIR); \
	npm ci; \
	npm run build

visualization: build_visualization
	cd $(VISUALIZATION_DIR); \
	npm run start

docker_visualization: docker_libs
	cd $(VISUALIZATION_DIR); \
	docker build --tag express-docker .

docker:
	$(DOCKER) compose up --build

docker_libs:
	$(foreach GLOBAL_LIB_DIR, $(wildcard $(GLOBALS_DIR_LIBS)/lib_*), cd "$(CURDIR)/$(GLOBAL_LIB_DIR)"; \
	  docker build --tag "local_image_$(shell basename $(GLOBAL_LIB_DIR))" .;)

build_libs:
	$(foreach GLOBAL_LIB_DIR, $(wildcard $(GLOBALS_DIR_LIBS)/lib_*), cd "$(CURDIR)/$(GLOBAL_LIB_DIR)"; \
	  npm ci && npm run compile;)

createCopyImages:
	cd images; \
	./create_images.sh 2>&1 | tee create_images.sh.log
	cd images; \
	./copy_images.sh 2>&1 | tee copy_images.sh.log

lintFix:
	$(foreach GLOBAL_LIB_DIR, $(wildcard $(GLOBALS_DIR_LIBS)/lib_*), cd "$(CURDIR)/$(GLOBAL_LIB_DIR)"; \
	  npm ci && npm run fix;)
	cd simulation; \
	npm ci && npm run fix
	cd visualization; \
	npm ci && npm run fix

# Other

installNecessaryPackagesPacman:
	sudo pacman --needed -S $(NECESSARY_PACKAGES_PACMAN)
	# Package list with versions for README.md
	@$(foreach NECESSARY_PACKAGE_PACMAN, $(sort $(NECESSARY_PACKAGES_PACMAN)), \
		echo "  - \`$(NECESSARY_PACKAGE_PACMAN)\` ($(shell pacman -Q $(NECESSARY_PACKAGE_PACMAN) | cut -d' ' -f2))"; \
	)

installNecessaryPackagesPacmanAur:
	yay --needed -S $(NECESSARY_PACKAGES_PACMAN_AUR)
	# Package list with versions for README.md
	@$(foreach NECESSARY_PACKAGE_PACMAN_AUR, $(sort $(NECESSARY_PACKAGES_PACMAN_AUR)), \
		echo "  - \`$(NECESSARY_PACKAGE_PACMAN_AUR)\` ($(shell yay -Q $(NECESSARY_PACKAGE_PACMAN_AUR) | cut -d' ' -f2))"; \
	)

installNecessaryPackagesUbuntu:
	sudo apt install $(NECESSARY_PACKAGES_UBUNTU_WSL)
	# Package list with versions for README.md
	@$(foreach NECESSARY_PACKAGE_UBUNTU_WSL, $(sort $(NECESSARY_PACKAGES_UBUNTU_WSL)), \
		echo "  - \`$(NECESSARY_PACKAGE_UBUNTU_WSL)\` ($(shell dpkg -s $(NECESSARY_PACKAGE_UBUNTU_WSL) | grep Version | cut -d' ' -f2))"; \
	)

installNecessaryPythonPackages:
	$(PYTHON) -m pip install $(NECESSARY_PACKAGES_PYTHON)
	# Package list with versions for README.md
	@$(foreach NECESSARY_PACKAGE_PYTHON, $(sort $(NECESSARY_PACKAGES_PYTHON)), \
		echo "  - \`$(NECESSARY_PACKAGE_PYTHON)\` ($(shell $(PYTHON) -m pip show $(NECESSARY_PACKAGE_PYTHON) | grep Version: | cut -d' ' -f2))"; \
	)
