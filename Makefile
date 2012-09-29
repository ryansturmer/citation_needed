xpi:
	cd bin
	cfx xpi
	cd ..
	python hash.py bin/citation_needed.xpi bin/citation_needed.json
