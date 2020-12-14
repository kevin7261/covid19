

function funcDraw_AboutMe_Main() {

	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_title")	
			.attr("class", "div_class_about_me font_size_10 color_main")	
				.text("author");

	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_content")	
			.attr("class", "div_class_about_me font_size_12 color_main")	
				.text("smilekevin");

	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_title")	
			.attr("class", "div_class_about_me font_size_10 color_main")	
				.text("email");

	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_content")	
			.attr("class", "div_class_about_me font_size_12 color_main")	
				.text("kevin7261@gmail.com");
				
	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_title")	
			.attr("class", "div_class_about_me font_size_10 color_main")	
				.text("data source");

	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_content")	
			.attr("class", "div_class_about_me font_size_12 color_main")	
				.text("Coronavirus Source Data by Hannah Ritchie (https://ourworldindata.org/coronavirus-source-data)");
				
	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_title")	
			.attr("class", "div_class_about_me font_size_10 color_main")	
				.text("version");

	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_content")	
			.attr("class", "div_class_about_me font_size_12 color_main")	
				.text("1.0");
				
	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_title")	
			.attr("class", "div_class_about_me font_size_10 color_main")	
				.text("update date");

	d3.select("#div_id_main")
		.append("div")	
			.attr("id", "div_id_about_me_content")	
			.attr("class", "div_class_about_me font_size_12 color_main")	
				.text("Aug. 1 2020");
}
