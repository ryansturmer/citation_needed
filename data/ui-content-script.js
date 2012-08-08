
console.log("UI Content script loaded.");

           var width = 960,
                height = 500,
                nodes = [],
                links = [],
                titles = {};

            force = d3.layout.force()
                        .charge(-120)
                        .linkDistance(30)
                        .size([width,height]);

            console.log("Creating svg element"); 
            svg = d3.select("body").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .style("border", "1px");

            force.on("tick", function() {
                svg.selectAll("line.link")
                     .attr("x1", function(d) { return d.source.x; })
                     .attr("y1", function(d) { return d.source.y; })
                     .attr("x2", function(d) { return d.target.x; })
                     .attr("y2", function(d) { return d.target.y; });

                svg.selectAll("circle.node")
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });

                });

            function update() {
                force
                    .nodes(nodes)
                    .links(links)
                    .start();
                svg.selectAll("line.link")
                    .data(links)
                    .enter().append("svg:line")
                    .attr("class", "link")
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                svg.selectAll("circle.node")
                    .data(nodes)
                    .enter().append("svg:circle")
                    .attr("class", "node")
                    .attr("r", 5)
                    .style("fill", "#222222")
                    .call(force.drag);

                force.start();
            }

            function add_node(title) {                
                if(!(title in titles)) {
                    titles[title] = null;
                    nodes.push(width/2, height/2);
                    update();
                }
            }

            function add_link(source, target) {
                add_node(source);
                add_node(target);
                //links.push({source:source, target:target});
                //update();
            }

add_node("hello");
update();
//self.port.on("visit_page", function(data) { add_link(data[0], data[1]); });
