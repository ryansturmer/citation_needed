# Argument parsing requires python 2.7
import argparse, sys, StringIO, subprocess, os
from citationneeded import create_multigraph_from_files, Blender 

parser = argparse.ArgumentParser(description="Convert citationneeded traversal files into rendered graphs")
parser.add_argument('FILE', type=str, nargs='+', help='CSV file to be converted')
parser.add_argument('-i','--individual', help='Produce output for single graphs', action='store_true')
parser.add_argument('-c','--combined', help='Produce output for group graphs', action='store_true')
parser.add_argument('-f', '--format', type=str, choices=('png', 'pdf', 'svg', 'jpg', 'ps'), help='Output format (PNG, PDF, SVG, JPG, PS)', default='pdf')
args = parser.parse_args()

# COLORS Are the individual colors, and the blender designates how they blend
# Colors are taken from the graphviz manual's table of acceptable color names
# The assumed color scheme is the X11 scheme (which is the default)
# http://www.graphviz.org/doc/info/colors.html
COLORS = ['red','blue','forestgreen','dimgray']
blender = Blender()
blender.set_blend('red','blue','purple')
blender.set_blend('red','forestgreen', 'goldenrod4')
blender.set_blend('red','dimgray', 'pink3')
blender.set_blend('blue', 'forestgreen', 'cyan4')
blender.set_blend('blue', 'dimgray', 'cornflowerblue')
blender.set_blend('forestgreen', 'dimgray', 'darkolivegreen4')
blender.set_blend('red','blue','forestgreen', 'salmon4')
blender.set_blend('red','blue','forestgreen', 'dimgray', 'salmon3')
# Note: currently, blender has to include all possible blends, or the program won't work.  There is no "default" blend.

def dot(input_data, file_format, output_filename):
    p = subprocess.Popen(['dot', '-T%s' % file_format], shell=False, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    out_data = p.communicate(input_data)[0]
    with open(output_filename, 'wb') as fp:
        fp.write(out_data)

def basename(f):
    return os.path.splitext(os.path.basename(f))[0]

multigraph = create_multigraph_from_files(args.FILE, COLORS, blender=blender)

if not args.individual and not args.combined:
    args.individual = True

if args.individual:
    for graph, filename in zip(list(multigraph), args.FILE):
        dot(graph.render(), args.format, basename(filename) + '.%s' % args.format)
if args.combined:
    dot(multigraph.render(), args.format, args.format)

sys.exit(0)


