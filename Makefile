serve:
	@python -m http.server -d ./src 9999

dev:
	@livereload ./src -p 9999

docs:
	@python -m http.server -d ./docs 8888
