xpi:
	cd bin; \
	cfx xpi --update-link https://github.com/ryansturmer/citation_needed/blob/master/bin/citation_needed.xpi?raw=true \
	        --update-url https://github.com/ryansturmer/citation_needed/blob/master/bin/citation_needed.update.rdf?raw=true; \
	cd ..; \
	python hash.py bin/citation_needed.xpi bin/citation_needed.js

run:
	cfx run -p sdk/profile
