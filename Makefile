.PHONY: install serve deploy

define say_red =
    echo "\033[31m$1\033[0m"
endef

define say_green =
    echo "\033[32m$1\033[0m"
endef

define say_yellow =
    echo "\033[33m$1\033[0m"
endef

help:
	@echo "\033[33mUsage:\033[0m"
	@echo "  make [command]"
	@echo ""
	@echo "\033[33mAvailable commands:\033[0m"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[32m%s\033[0m___%s\n", $$1, $$2}' | column -ts___

install: ## Install project
	composer install
	vendor/bin/sculpin install

serve: ## Run server & watch
	vendor/bin/sculpin generate --watch --server --port 8007

deploy: ## Deploy the project
	vendor/bin/sculpin generate --env=prod
	rsync -avr --delete-after --delete-excluded output_prod/ static_deploy:/space/products/blog/
