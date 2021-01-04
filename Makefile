serve:
	@python -m http.server -d ./docs 9999

dev:
	@livereload ./docs -p 9999
