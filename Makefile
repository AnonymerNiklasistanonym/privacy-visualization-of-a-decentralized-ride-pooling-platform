.PHONY: build clean format
.PHONY: installNecessaryPackagesPacman installNecessaryPackagesUbuntu

NECESSARY_PACKAGES_PACMAN = make texlive-latex texlive-binextra texlive-xetex texlive-latexextra texlive-luatex texlive-fontsrecommended texlive-langgerman texlive-langenglish texlive-mathscience texlive-bibtexextra texlive-plaingeneric texlive-publishers perl-yaml-tiny perl-file-homedir aspell aspell-en biber
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

installNecessaryPackagesUbuntu:
	sudo apt install $(NECESSARY_PACKAGES_UBUNTU_WSL)
	# Package list with versions for README.md
	@$(foreach NECESSARY_PACKAGE_UBUNTU_WSL, $(sort $(NECESSARY_PACKAGES_UBUNTU_WSL)), \
		echo "  - \`$(NECESSARY_PACKAGE_UBUNTU_WSL)\` ($(shell dpkg -s $(NECESSARY_PACKAGE_UBUNTU_WSL) | grep Version | cut -d' ' -f2))"; \
	)
