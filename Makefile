dev:
	@yarn docs:dev

build:
	@yarn docs:build

serve:
	@sanic ./docs --simple --port=8080
