# to see all colors, run
# bash -c 'for c in {0..255}; do tput setaf $c; tput setaf $c | cat -v; echo =$c; done'
# the first 15 entries are the 8-bit colors

# define standard colors
ifneq (,$(findstring xterm,${TERM}))
	BLACK        := $(shell tput -Txterm setaf 0)
	RED          := $(shell tput -Txterm setaf 1)
	GREEN        := $(shell tput -Txterm setaf 2)
	YELLOW       := $(shell tput -Txterm setaf 3)
	LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
	PURPLE       := $(shell tput -Txterm setaf 5)
	BLUE         := $(shell tput -Txterm setaf 6)
	WHITE        := $(shell tput -Txterm setaf 7)
	RESET := $(shell tput -Txterm sgr0)
else
	BLACK        := ""
	RED          := ""
	GREEN        := ""
	YELLOW       := ""
	LIGHTPURPLE  := ""
	PURPLE       := ""
	BLUE         := ""
	WHITE        := ""
	RESET        := ""
endif

# set target color
TARGET_COLOR := $(BLUE)

POUND = \#

.PHONY: no_targets__ info help build deploy doc
	no_targets__:

.DEFAULT_GOAL := help

help:
	@echo ""
	@echo "    ${BLACK}:: ${RED}Self-documenting Makefile${RESET} ${BLACK}::${RESET}"
	@echo ""
	@echo "Document targets by adding '$(POUND)$(POUND) comment' after the target"
	@echo ""
	@echo "Example:"
	@echo "  | job1:  $(POUND)$(POUND) help for job 1"
	@echo "  | 	@echo \"run stuff for target1\""
	@echo ""
	@echo "Please use ${TARGET_COLOR}\`make <target>\`${RESET} where ${TARGET_COLOR}<target>${RESET} is one of:"
	@echo "${BLACK}-----------------------------------------------------------------${RESET}"
	@grep -E '^[a-zA-Z_0-9%-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "${TARGET_COLOR}%-30s${RESET} %s\n", $$1, $$2}'

colors: ## show all the colors
	@echo "${BLACK}BLACK${RESET}"
	@echo "${RED}RED${RESET}"
	@echo "${GREEN}GREEN${RESET}"
	@echo "${YELLOW}YELLOW${RESET}"
	@echo "${LIGHTPURPLE}LIGHTPURPLE${RESET}"
	@echo "${PURPLE}PURPLE${RESET}"
	@echo "${BLUE}BLUE${RESET}"
	@echo "${WHITE}WHITE${RESET}"

job1:  ## help for job 1
	@echo "job 1 started"
	@$(MAKE) job2
	@echo "job 1 finished"

job2:  ## help for job 2
	@echo "job 2"

job%:  ## help for job with wildcard
	@echo "job $@"

lint: ## Run linters
	@$(MAKE) prettier
	@$(MAKE) eslint
	@$(MAKE) jshint
	@$(MAKE) stylelint
	@$(MAKE) htmlhint

prettier: ## Run prettier
	@npx prettier --write .

eslint:  ## Run eslint
	@npx eslint --fix '**/*.js'

jshint:  ## Run js hint
	@npx jshint --verbose 'js/'

stylelint:  ## Run stylelint
	@npx stylelint --fix '**/*.css'

htmlhint:  ## Run htmlhint
	@npx htmlhint --rules attr-sorted "**/*.html"

server: ## Run a local server
	@npx http-server -c-1

server-https: ## Run a local server with https
	@npx http-server -c-1 -S -C cert.pem

server-cert-create: ## Create a self-signed certificate
	@openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 3650 -new -nodes \
		-subj "/C=SE/ST=Stockholm/L=Stockholm/O=BeepBoop/OU=IT/CN=127.0.0.1"

server-trust-cert: ## Trust the self-signed certificate
	@sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain cert.pem

# vim:noexpandtab:ts=8:sw=8:ai
