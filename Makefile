.DEFAULT_GOAL := help

help:
	@echo "\033[33mUsage:\033[0m"
	@echo "  make [command]"
	@echo ""
	@echo "\033[33mAvailable commands:\033[0m"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[32m%s\033[0m___%s\n", $$1, $$2}' | column -ts___

.PHONY: install
install: ## Install project
	@echo "Nothing to do ! 👌"

.PHONY: serve
serve: ## Run server & watch
	BOX_REQUIREMENT_CHECKER=0 php cecil.phar serve

.PHONY: deploy
deploy: ## Deploy the project
	BOX_REQUIREMENT_CHECKER=0 php cecil.phar build
	rsync -avr --delete-after --delete-excluded _site/ deploy:/var/www/odolbeau.fr/
