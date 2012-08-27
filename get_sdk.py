import sys, os, urllib, shutil
from urlparse import urlparse
from zipfile import ZipFile

SDK_DIR = 'sdk'
TMP_DIR = os.path.join(SDK_DIR, 'tmp')
MOZILLA_SDK = 'https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/addon-sdk-1.9.zip'

VOLD_UTILS = 'https://github.com/voldsoftware/vold-utils-jplib/zipball/master'
VOLD_MENUITEMS = 'https://github.com/voldsoftware/menuitems-jplib/zipball/master'

EXTENSIONS = (VOLD_UTILS, VOLD_MENUITEMS)

def fetch(url, localpath=SDK_DIR):
    path, sep, fn = url.rpartition('/')
    print 'Getting file "%s" from "%s"...' % (fn, path), 
    sys.stdout.flush()
    local_fn = os.path.join(localpath, fn)
    urllib.urlretrieve(url, local_fn)
    print 'done.'
    return local_fn

def decompress(fn, localpath):
    print 'Decompressing %s...' % fn,
    sys.stdout.flush()
    with ZipFile(fn) as zfp:
        zfp.extractall(localpath)
    print "done."

def get_sdk():
    sdk = fetch(MOZILLA_SDK, TMP_DIR)
    decompress(sdk, SDK_DIR)
    return os.path.join(SDK_DIR, os.listdir(SDK_DIR)[0])

def get_extension(url, sdk):
    ext = fetch(url, TMP_DIR)
    decompress(ext, os.path.join(sdk, 'packages'))
    print ''

def get_extensions(sdk):
    for url in EXTENSIONS:
        get_extension(url, sdk)

if __name__ == "__main__":
    if os.path.exists(SDK_DIR):
        print "SDK dir exists already!"
        if(raw_input('Delete and re-download SDK? (Y/n): ') in ('N','n')):
            sys.exit(0)
        shutil.rmtree(SDK_DIR)

    print ''
    print '-----------------------------'
    print 'Mozilla Add-on SDK Downloader'
    print '-----------------------------'
    print ''
    
    # Create directories that will hold the SDK files
    os.mkdir(SDK_DIR)
    os.mkdir(TMP_DIR)

    # Grab the SDK
    sdk = get_sdk()
    print ''

    # Grab the extensions and install them in the SDK tree
    get_extensions(sdk)
    
    # All finished
    print 'Done.\n'
