OUTPUT=extension/citation_needed.xpi

all: 
	zip -r -x@exclude.lst $(OUTPUT) chrome chrome.manifest defaults install.rdf 
clean:
	rm -rf $(OUTPUT)
