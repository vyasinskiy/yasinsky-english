clean-start:
	make clean
	npm install
	npm run start

clean:
	rm -rf dist node_modules package-lock.json