
all: install

clear:
	@rm -rf node_modules
	@rm -rf pagkage-lock.json
	@rm -rf yarn-error.log
	@rm -rf yarn.lock

install:
	@npm install

reinstall:
	@make clear
	@make install
	
update:
	@npm update

publish:
	@rm -rf node_modules
	@rm -rf pagkage-lock.json
	@rm -rf yarn-error.log
	@rm -rf yarn.lock
	@npm set registry https://registry.npmjs.org
	@npm publish