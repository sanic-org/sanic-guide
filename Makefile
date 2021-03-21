dev:
	@yarn docs:dev

build:
	@yarn docs:build

serve:
	@python -m http.server --directory=./docs 8080
