.PHONY: serve deploy

serve:
	sculpin generate --watch --server

deploy:
	sculpin generate --env=prod
	scp -r output_prod/* sd67004-deploy:/space/products/blog/
