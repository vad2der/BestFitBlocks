$(function () {
	var data = [{"height": 20, "width": 20, "n": 2},
				{"height": 20, "width": 30, "n": 1},
				{"height": 20, "width": 40, "n": 3}];

	//messaging
	function message(type,message_body){
		var type_of_message = (type == "success" ? "alert alert-success": "alert alert-warning");
		$('#message_box').text(message_body);
		$('#message_box').addClass(type_of_message);
		setTimeout(function(){						
			$('#message_box').text("");
			$('#message_box').removeClass(type_of_message);
		}, 3000);
	};

	//variable to put array of blocks in
	var blocks = [];

	const color = d3.scale.category20();

	// data getter
	function loadData() {
		var jqxhr = $.getJSON( "example.json", function(data) {
  		console.log( data);
		}).done(function() {
    		console.log( "second success" );
  		}).fail(function() {
    		console.log( "error" );
  		})
	};

	//simple blocks demonstrator <ol><li>
	function showBlocks(){
		const height = $("#list").height();		
		const width = $("#list").width();			
		// clear previous d3 instances
		d3.selectAll("svg").remove();
		// Append a group
		var legend_canvas = d3.select('#list')
                			.append('ul')                
  
  		var legend = legend_canvas.selectAll('ul')                
                				.data(data)
                				.enter()
                  				.append("li")
                    			.append('svg')
                    			.attr('width', '100%')
    							.attr('height', d=> 2*d.height);

        legend.append('svg:rect')
    		.attr('width', d => d.width)
    		.attr('height', d=> d.height)
    		.style('fill', (d,i) => color(i));

    	legend.append('svg:text')
    		.data(data)
    		.attr('x', d => d.width + 15)
    		.attr('y', 15)
    		.text(d => "x "+d.n)
    		.style('fill', '#1c1c23');
	};

	function drawCanvas(){
		const height = $("#canvas").height();		
		const width = $("#canvas").width();			
		// clear previous d3 instances
		d3.selectAll("svg").remove();
		// Append a group
		const canvas = d3.select('#canvas')
      					.append('svg')
      					.attr('width', width)
      					.attr('height', height);
      					    						

	};

	//starting message
	$('body').ready(message("success","let's start"));
	drawCanvas();
	showBlocks();
});