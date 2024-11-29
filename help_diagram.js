// Data structure for the calculation flow
const data = {
    nodes: [
        // Input nodes (green)
        { id: "date", label: "Date", type: "input", x: 100, y: 50 },
        { id: "latitude", label: "Latitude", type: "input", x: 100, y: 150 },
        { id: "longitude", label: "Longitude", type: "input", x: 100, y: 250 },
        { id: "timezone", label: "Time Zone", type: "input", x: 100, y: 350 },

        // Calculation nodes (blue)
        { id: "julianDay", label: "Julian Day", type: "calculation", x: 300, y: 50 },
        { id: "julianCentury", label: "Julian Century", type: "calculation", x: 300, y: 150 },
        { id: "solarLongitude", label: "Solar Longitude", type: "calculation", x: 500, y: 100 },
        { id: "obliquity", label: "Obliquity", type: "calculation", x: 500, y: 200 },
        { id: "hourAngle", label: "Hour Angle", type: "calculation", x: 500, y: 300 },

        // Output nodes (orange)
        { id: "declination", label: "Solar Declination", type: "output", x: 700, y: 150 },
        { id: "elevation", label: "Solar Elevation", type: "output", x: 700, y: 250 },
        { id: "azimuth", label: "Solar Azimuth", type: "output", x: 700, y: 350 }
    ],
    links: [
        // Input to calculation links
        { source: "date", target: "julianDay" },
        { source: "julianDay", target: "julianCentury" },
        { source: "julianCentury", target: "solarLongitude" },
        { source: "julianCentury", target: "obliquity" },
        { source: "longitude", target: "hourAngle" },
        { source: "timezone", target: "hourAngle" },

        // Calculation to output links
        { source: "solarLongitude", target: "declination" },
        { source: "obliquity", target: "declination" },
        { source: "declination", target: "elevation" },
        { source: "latitude", target: "elevation" },
        { source: "declination", target: "azimuth" },
        { source: "hourAngle", target: "azimuth" },
        { source: "latitude", target: "azimuth" }
    ]
};

// Set up the SVG
const width = 900;
const height = 500;

const svg = d3.select("#diagram")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create arrow marker for links
svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("xoverflow", "visible")
    .append("path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#999")
    .style("stroke", "none");

// Draw the links
const links = svg.selectAll(".link")
    .data(data.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d => {
        const sourceNode = data.nodes.find(n => n.id === d.source);
        const targetNode = data.nodes.find(n => n.id === d.target);
        return `M ${sourceNode.x} ${sourceNode.y} 
                Q ${(sourceNode.x + targetNode.x) / 2} ${sourceNode.y},
                  ${(sourceNode.x + targetNode.x) / 2} ${(sourceNode.y + targetNode.y) / 2}
                Q ${(sourceNode.x + targetNode.x) / 2} ${targetNode.y},
                  ${targetNode.x} ${targetNode.y}`;
    })
    .attr("marker-end", "url(#arrowhead)");

// Draw the nodes
const nodeGroups = svg.selectAll(".node-group")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("class", "node-group")
    .attr("transform", d => `translate(${d.x},${d.y})`);

// Add rectangles for nodes
nodeGroups.append("rect")
    .attr("class", d => `node ${d.type}-box`)
    .attr("x", -50)
    .attr("y", -15)
    .attr("width", 100)
    .attr("height", 30)
    .attr("rx", 5)
    .attr("ry", 5);

// Add labels
nodeGroups.append("text")
    .attr("class", "node-label")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .text(d => d.label);

// Add interactivity
nodeGroups
    .on("mouseover", function(event, d) {
        // Highlight connected links
        links.style("stroke", link => 
            (link.source === d.id || link.target === d.id) ? "#2196F3" : "#999")
            .style("stroke-width", link => 
                (link.source === d.id || link.target === d.id) ? "2.5px" : "1.5px");
        
        // Highlight node
        d3.select(this).select("rect")
            .style("stroke-width", "2.5px")
            .style("filter", "drop-shadow(0 0 3px rgba(0,0,0,0.3))");
    })
    .on("mouseout", function() {
        // Reset links
        links.style("stroke", "#999")
            .style("stroke-width", "1.5px");
        
        // Reset node
        d3.select(this).select("rect")
            .style("stroke-width", "1.5px")
            .style("filter", "none");
    });

// Add tooltips with equations
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "white")
    .style("padding", "5px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px")
    .style("pointer-events", "none");

nodeGroups
    .on("mouseover.tooltip", function(event, d) {
        tooltip.style("visibility", "visible")
            .html(getEquation(d.id));
    })
    .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout.tooltip", function() {
        tooltip.style("visibility", "hidden");
    });

function getEquation(nodeId) {
    const equations = {
        julianDay: "JD = date.getTime()/86400000 + 2440587.5 + timeZone/24",
        julianCentury: "JC = (JD - 2451545) / 36525",
        declination: "δ = asin(sin(ε) * sin(λ))",
        elevation: "α = 90° - |latitude - solar_declination|",
        azimuth: "A = atan2(sin(H), cos(H) * sin(φ) - tan(δ) * cos(φ))"
    };
    return equations[nodeId] || "";
}
