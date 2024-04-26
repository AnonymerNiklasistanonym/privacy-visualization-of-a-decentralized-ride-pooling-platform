.PHONY: build clean format
.PHONY: installNecessaryPackagesPacman installNecessaryPackagesPacmanAur installNecessaryPackagesUbuntu
.PHONY: copyGlobals createCopyImages lintFix

NECESSARY_PACKAGES_PACMAN = make texlive-latex texlive-binextra texlive-xetex texlive-latexextra texlive-luatex texlive-fontsrecommended texlive-langgerman texlive-langenglish texlive-mathscience texlive-bibtexextra texlive-plaingeneric texlive-publishers perl-yaml-tiny perl-file-homedir aspell aspell-en biber nodejs docker docker-compose python yay
NECESSARY_PACKAGES_PACMAN_AUR = powershell-bin
NECESSARY_PACKAGES_UBUNTU_WSL = make texlive-full latexmk python3-pygments biber aspell

LATEXINDENT?=latexindent
LATEXINDENT_ARGS?=--overwriteIfDifferent \
                  --silent \
                  --local="$(CURDIR)/latex/indentconfig.yaml"

SPD_DIR=student-project-description

all: build

build:
	$(MAKE) -C "$(SPD_DIR)"

clean:
	$(MAKE) -C "$(SPD_DIR)" clean

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
	npm run fix
	cd simulation; \
	npm run fix
	cd visualization; \
	npm run fix
