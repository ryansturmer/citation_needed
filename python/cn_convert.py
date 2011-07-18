import sys,csv

class WikiGraph(object):
	def __init__(self):
		self.nodes = {}
		self.new_edges = set()
		self.referred_edges = set()
		self.non_referred_edges = set()
                self.edge_labels = {}
		self.current_node = None
		self.current_node_timestamp = 0
		self.root = None
                self.idx = 1
	@property
	def max_time(self):
		return max(self.nodes.values())

	def visit(self, topic, predecessor, timestamp):
		#print "current: %s" % self.current_node
		#print "%s,%s,%s" % (predecessor, topic, timestamp)
                if not topic.strip():
                    return
                edge = None
                if predecessor:
			if self.current_node and predecessor != self.current_node:
				pass
				#print "Warning, graph inconsistency!  Predecessor in referred link doesn't match current node"
			
                        edge = (predecessor, topic)
                        if topic not in self.nodes:
				self.new_edges.add(edge)
			else:
				self.referred_edges.add(edge)
		else:
			if self.current_node:
				if self.current_node != topic:
                                        edge = (self.current_node, topic)
					self.non_referred_edges.add(edge)
                if edge:
                    if edge not in self.edge_labels:
                        self.edge_labels[edge] = str(self.idx)
                    else:
                        self.edge_labels[edge] += ",%s" % self.idx
                    self.idx += 1
		if not self.current_node:
			self.root = topic
		
		self.current_node = topic
		
		if topic not in self.nodes:
			self.nodes[topic] = 0
	
		if self.current_node_timestamp != 0:
			self.nodes[self.current_node] += timestamp - self.current_node_timestamp
		self.current_node_timestamp = timestamp

	def render(self):
		retval = "digraph CitationNeeded {\n"
		for node in self.nodes.keys():
			percentage = 255-int(128*(float(self.nodes[node])/self.max_time))
			color = "#" + (("%02x" % percentage)*3)
			if node == self.root:
				retval += '  node [style=bold,fontcolor=red]; "%s";\n' % node
			else:
				retval += '  node [style=solid,fontcolor=black]; "%s";\n' % node
			#retval += "  node [style=filled,bgcolor=\"%s\"]; \"%s\"\n" % (color, node)

		for a,b in self.new_edges:
			retval += '  "%s" -> "%s" [style="bold",label="%s", labelfontcolor=red];\n' % (a,b,self.edge_labels[(a,b)])

		for a,b in self.referred_edges:
			retval += '  "%s" -> "%s" [style="solid",label="%s",labelfontcolor=red];\n' % (a,b,self.edge_labels[(a,b)])
		
		for a,b in self.non_referred_edges:
			retval += '  "%s" -> "%s" [style="dotted",label="%s",labelfontcolor=red];\n' % (a,b,self.edge_labels[(a,b)])

		retval += '}'
		return retval
		
	@staticmethod
	def load(filename):
		graph = WikiGraph()
		with open(filename, 'rb') as fp:
			fp.readline()
			reader = csv.reader(fp)
			for tokens in reader:
				if len(tokens) == 5:
					timestamp = int(tokens[0].strip())
					pre_topic = tokens[1].strip()
					pre_subtopic = tokens[2].strip()
					topic = tokens[3].strip()
					subtopic = tokens[4].strip()
					
					p = pre_topic + ":" + pre_subtopic if pre_subtopic else pre_topic
					t = topic + ":" + subtopic if subtopic else topic
					graph.visit(t, p, timestamp)
		return graph

if __name__ == "__main__":
	if len(sys.argv) > 1:
		filename = sys.argv[1]
		graph = WikiGraph.load(filename)
		print graph.render()
		sys.exit(0)
	graph = WikiGraph.load("../data/output.csv")


