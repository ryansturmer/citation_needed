from citationneeded import beautify, WikiGraph
from jinja2 import Environment, PackageLoader
env = Environment(loader=PackageLoader('podcast_html', 'templates'))
graph = WikiGraph.load('ryan.csv')
template = env.get_template('arbor.html')

nodes = [(beautify(node), node) for node in graph.nodes]
edges = [(beautify(a), beautify(b)) for a,b in graph.edges]
with open('html/output.html', 'wb') as fp:
    fp.write(template.render(nodes = nodes, edges=edges))

