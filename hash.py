import json, hashlib, sys

if len(sys.argv) < 3:
    print "Usage: python hash.py INFILE OUTFILE"
    sys.exit(0)

with open(sys.argv[1]) as fp:
    sha1 = hashlib.sha1()
    sha1.update(fp.read())
    h = sha1.hexdigest()

json_string = json.dumps({'hash' : 'sha1:%s' % h})

print "Generating SHA1 Hash"
print "--------------------"
print json_string
print ""

with open(sys.argv[2], 'w') as fp:
    fp.write(json_string)

