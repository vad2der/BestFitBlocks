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
		 actualProcess();
	}
	//simple blocks demonstrator <ol><li>
	function showBlocks(){
		const height = $("#list").height();		
		const width = $("#list").width();			
		// clear previous d3 instances
		d3.selectAll("svg").remove();
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
    		.style('fill', (d,i) => color(i));

    	legend.append('svg:text')
    		.data(data.boxes)
    		.attr('x', d => d.width + 5)
    		.attr('y',25)
    		.text(d => "x "+d.count+" ("+d.width+"x"+d.height+")")
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
	//$('body').ready(message("success","let's start"));
	
	
	//console.log(data);

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
		// sort by value
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
		drawCanvas();
		showBlocks();
	};		
});