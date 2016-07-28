.PHONY: serve deploy

serve:
	sculpin generate --watch --server

deploy:
	sculpin generate --env=prod
	rsync -avr --delete-after --delete-excluded output_prod/ sd67004-deploy:/space/products/blog/
