.PHONY: clean format
.PHONY: build_spd build_thesis build_simulation build_visualization
.PHONY: docker
.PHONY: installNecessaryPackagesPacman installNecessaryPackagesPacmanAur installNecessaryPackagesUbuntu installNecessaryPythonPackages
.PHONY: copyGlobals createCopyImages lintFix

NECESSARY_PACKAGES_PACMAN = make texlive-latex texlive-binextra texlive-xetex texlive-latexextra texlive-luatex texlive-fontsrecommended texlive-langgerman texlive-langenglish texlive-mathscience texlive-bibtexextra texlive-plaingeneric texlive-publishers perl-yaml-tiny perl-file-homedir aspell aspell-en biber nodejs docker docker-compose python yay
NECESSARY_PACKAGES_PACMAN_AUR = powershell-bin
NECESSARY_PACKAGES_UBUNTU_WSL = make texlive-full latexmk python3-pygments biber aspell
NECESSARY_PACKAGES_PYTHON = pygments-tsx

LATEXINDENT?=latexindent
LATEXINDENT_ARGS?=--overwriteIfDifferent \
                  --silent \
                  --local="$(CURDIR)/latex/indentconfig.yaml"
DOCKER?=docker
PYTHON?=python

SPD_DIR=student-project-description
THESIS_DIR=thesis
SIMULATION_DIR=simulation
VISUALIZATION_DIR=visualization
GLOBALS_DIR_TYPESCRIPT=globals/typescript

all: build_spd build_thesis build_simulation build_visualization

build_spd:
	$(MAKE) -C "$(SPD_DIR)"

build_thesis:
	$(MAKE) -C "$(THESIS_DIR)" batch

build_simulation:
	cd $(SIMULATION_DIR); \
	npm install; \
	npm run build
#	cd $(SIMULATION_DIR); \
#	docker build --tag nextjs-docker .

build_visualization:
	cd $(VISUALIZATION_DIR); \
	npm install; \
	npm run build
#	cd $(VISUALIZATION_DIR); \
#	docker build --tag express-docker .

clean:
	$(MAKE) -C "$(SPD_DIR)" clean
	$(MAKE) -C "$(THESIS_DIR)" clean
	rm -rf $(SIMULATION_DIR)/node_modules
	rm -rf $(SIMULATION_DIR)/build $(SIMULATION_DIR)/cache $(SIMULATION_DIR)/dist $(SIMULATION_DIR)/docs $(SIMULATION_DIR)/logs
	rm -rf $(VISUALIZATION_DIR)/node_modules $(VISUALIZATION_DIR)/.next
	rm -rf $(GLOBALS_DIR_TYPESCRIPT)/node_modules

docker:
	$(DOCKER) compose up --build

format:
	$(LATEXINDENT) $(LATEXINDENT_ARGS) latex/globals/*.tex

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

copyGlobals:
	cd globals; \
	./copy.ps1

createCopyImages:
	cd images; \
	./create_images.sh 2>&1 | tee create_images.sh.log
	cd images; \
	./copy_images.sh 2>&1 | tee copy_images.sh.log

lintFix:
	cd globals/typescript; \
	npm ci && npm run fix
	cd simulation; \
	npm ci && npm run fix
	cd visualization; \
	npm ci && npm run fix
