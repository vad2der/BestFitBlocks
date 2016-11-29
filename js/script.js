$(function () {
	var data;

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
		$.post("https://beta.sitevisit360.com/hiring/json_boxes"	
  		).done(function(response) {
    		message("success","data loaded")    		
    		data = jQuery.parseJSON(response);
    		actualProcess();  		
  		}).fail(function() {
    		message("warning","could not get data")
  		})
	};

	function localData(){
		data =
		{"boxes": [
		 {"count": 25, "width": 50, "height": 50},
		 {"count": 25, "width": 31, "height": 47},
		 {"count": 25, "width": 17, "height": 23},
		 {"count": 10, "width": 42, "height": 109},
		 {"count": 25, "width": 109, "height": 42},
		 {"count": 25, "width": 33, "height": 17},
		 {"count": 15, "width": 20, "height": 20},
		 {"count": 100, "width": 13, "height": 15},
		 {"count": 10, "width": 100, "height": 100},
		 {"count": 20, "width": 8, "height": 30},
		 {"count": 1, "width": 60, "height": 300}],
		 "maxheight": 600, "maxwidth": 800};
		 $('body').ready(message("success","local data assigned"));
		 actualProcess();
	}
	//simple blocks demonstrator <ol><li>
	function showBlocks(){
		const height = $("#list").height();		
		const width = $("#list").width();			
		// clear previous d3 instances
		d3.select('#list').selectAll("svg").remove();
		// Append a group
		var legend_canvas = d3.select('#list')
                			.append('ul')                
  		if (data == undefined){return};
  		var legend = legend_canvas.selectAll('ul')                
                				.data(data.boxes)
                				.enter()
                  				.append("li")
                    			.append('svg')
                    			.attr('width', '100%')
    							.attr('height', d=> d.height > 30 ? d.height : 30);

        legend.append('svg:rect')
    		.attr('width', d => d.width)
    		.attr('height', d=> d.height)
    		.style('fill', (d,i) => color(d.width/10))
    		.style('stroke', 'black')
    		.style('stroke-width', '1px');

    	legend.append('svg:text')
    		.data(data.boxes)
    		.attr('x', d => d.width + 5)
    		.attr('y',25)
    		.text(d => "x "+d.count+" ("+d.width+"x"+d.height+")")
    		.style('fill', '#1c1c23');
	};	
	
	var height = 600;
	var width = 800;
		// clear previous d3 instances
	d3.selectAll("svg").remove();
		// Append a group
	var canvas = d3.select('#canvas')
      				.append('svg')
      				.attr('width', width)
      				.attr('height', height);	

	function refineDirection(){
		var result = [];
		for (var ind in data.boxes){
			if(data.boxes[ind].height > data.boxes[ind].width){
				result.push({count: data.boxes[ind].count,
					height: data.boxes[ind].width,
					width: data.boxes[ind].height
				})
			}else{result.push(data.boxes[ind])}
		}
		data.boxes = result;
	};

	$('button#loadDataFromURL').on('click', loadData);
	$('button#useLocalData').on('click', localData);
	//data.boxes = mergeSort(data.boxes);
	
	function actualProcess(){
		refineDirection()
		// sort by width
		data.boxes.sort(function (a, b) {
		  	if (a.width > b.width) {
			    return -1;
		  	}
		  	if (a.width < b.width) {
		    	return 1;
		  	}
		  // a must be equal to b
		  		return 0;
		});
		
		showBlocks();
		create_coord();
	};

	var boxes_by_group;
	function create_coord(){
		var points_of_insertion = {0: 0, 600: 800}; //format is {y: x}
		
		boxes_by_group = data.boxes;
		// sort by height
		boxes_by_group.sort(function (a, b) {
		  	if (a.height > b.height) {
			    return -1;
		  	}
		  	if (a.height < b.height) {
		    	return 1;
		  	}
		  	// a must be equal to b
		  		return 0;
		});
		
		var S_boxes = 0; //area of inserted boxws
		var S = height*width; //area of canvas		

		var boxes_separately = [];

		Object.keys(boxes_by_group).forEach(function(b_key){
			//console.log(b_key, boxes_by_group[b_key].count);
			for(b_ind=0; b_ind < boxes_by_group[b_key].count; b_ind++){
				//console.log(boxes_by_group[b_key].width, boxes_by_group[b_key].height, boxes_by_group[b_key].count);
				boxes_separately.push( {'width': boxes_by_group[b_key].width, 'height': boxes_by_group[b_key].height});
			};
		});
		
		var placed_boxes = [];
		
		boxes_separately.forEach(function(elem){			
			elem.width = parseInt(elem.width);
			elem.height = parseInt(elem.height);
			tryToPlaceBox(elem);
		});

		function tryToPlaceBox(elem){

			var arr = Object.keys(points_of_insertion).sort();
			
			for(ind = 0; ind < arr.length-1; ind++){				
				//console.log('!!!!!!!');
				var poi_y = parseInt(arr[ind]);
				var poi_x = parseInt(points_of_insertion[poi_y]);
				//console.log(ind, arr[ind]);
				
				// Check if elem fits
				if((elem.width+poi_x <= 800) && (elem.height+poi_y <= parseInt(arr[ind+1]))){
					// Add box to representation array with coordinates
					placed_boxes.push({'height': elem.height, 'width': elem.width, 'x': poi_x, 'y': poi_y});
					S_boxes += elem.height*elem.width;
					// Update X for point of insertion
					points_of_insertion[poi_y] = poi_x+elem.width;
					// Check if height below already declared
					if(Object.keys(points_of_insertion).indexOf(String(poi_y+elem.height)) == -1){
						// Add new point of insertion
						points_of_insertion[parseInt(poi_y+elem.height)] = parseInt(poi_x);
						//console.log(points_of_insertion);
					};
					break;
				};
			
			};
		};
		message("success",100*S_boxes/S+ " % of fill")
		console.log(100*S_boxes/S+ " %");
		// console.log(placed_boxes);
		var b = canvas.selectAll('rect')
					.data(placed_boxes)
					.enter()
					.append('rect');

					b.attr("y", function(d){return d.y;})
    					.attr("x", function(d){return d.x;})
	    				.attr("width", function(d){return d.width;})
						.attr("height", function(d){return d.height;})
    					.style('fill', function(d, i){return color(d.width/10);})
    					.style('stroke', 'black')
    					.style('stroke-width', '1px')
    					.on("mouseover", handleMouseOver)
    					.on('mouseout', handleMouseOut);
		
	};

	function handleMouseOver(d,i){
		var thisUnderMouse = this
		d3.select('#canvas').selectAll('rect')
			.filter(function(d,i) {
      			return (this !== thisUnderMouse);})
			.transition()
    		.duration(200)
			.style("opacity", 0.2);

		d3.select(this)
			.style("opacity", 1);
	}

	function handleMouseOut(d,i){		
		d3.select('#canvas').selectAll('rect')			
			.transition()
    		.duration(200)
			.style("opacity", 1);

	}

});