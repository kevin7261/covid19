
var fScale_All;

var fHeightScale = 0.9;

var g_nTotalCasesCount_Max = 0;

var ALL_HEIGHT = COUNTRY_HEIGHT * 2;

function funcDraw_All_Main() {

	let d3LineInterpolate = (g_nLineType == 0)	? d3.curveLinear : d3.curveMonotoneX;

	sDate_Min = d3.min(g_dsAll, function (d) { return d.ymd; }).toString();//"191231"; 
	sDate_Max = d3.max(g_dsAll, function (d) { return d.ymd; }).toString();//"200728";

	sDate_Min = sDate_Min.substring(0, 4) + "-" + sDate_Min.substring(4, 6) + "-" + sDate_Min.substring(6, 8)
	sDate_Max = sDate_Max.substring(0, 4) + "-" + sDate_Max.substring(4, 6) + "-" + sDate_Max.substring(6, 8)

	let nDate_Count = getDateCount(sDate_Min, sDate_Max) + 1;

	g_nTotalCasesCount_Max = 0;//d3.max(g_dsDate, function (d) { return d.total_cases; });

	for (let nType = 0; nType < vDataType.length; nType++) {

		if (vDataType[nType].path_display) {

			let nCount = d3.max(g_dsDate, function (d_date) { 
			
				let nCount = 0;

				switch (nType) {

					case DATA_TYPE_TOTAL_CASES: 	{ nCount = d_date.total_cases; break; }
					case DATA_TYPE_NEW_CASES: 		{ nCount = d_date.new_cases; break; }
					case DATA_TYPE_TOTAL_DEATHS: 	{ nCount = d_date.total_deaths; break; }
					case DATA_TYPE_NEW_DEATHS: 		{ nCount = d_date.new_deaths; break; }
				}

				return nCount; 
			});

			if (g_nTotalCasesCount_Max < nCount)
				g_nTotalCasesCount_Max = nCount;
		}
	}

	// -------

	let nIndexTop = d3.format(".1r")(g_nTotalCasesCount_Max)

	g_vTotalIndex = [];

	var nIntervalCount = 4;

	for (let i = 1; i <= nIntervalCount; i++) {

		g_vTotalIndex.push(nIndexTop / nIntervalCount * i)
	}

	// -------

	//console.log(sDate_Min, sDate_Max, nDate_Count, g_nTotalCasesCount_Max)

	// -------

	fScale_All = d3.scaleLinear()
							.domain([0, 1])
							.range([0, ALL_HEIGHT]);

	fScale_Date_PT = d3.scaleLinear()
							.domain([0, nDate_Count])
							.range([0, MAIN_WIDTH]);

	fScale_Date_PX = d3.scaleLinear()
							.domain([0, nDate_Count])
							.range([0, funcGetSVGMain_PX(MAIN_WIDTH)]);

	fScale_Total_PX = d3.scaleLinear()
							.domain([0, g_nTotalCasesCount_Max])
							.range([0, funcGetSVGMain_PX(ALL_HEIGHT * fHeightScale)]);

	// ---------------------------------------------------------------

	let divOptions_Background = d3.select("#div_id_page_options_background");

	let divOptions = divOptions_Background.append("div")
												.attr("id", "div_id_page_options");

	funcDraw_CountriesDisplay_All(divOptions);

	funcDraw_LineType_All(divOptions);

	// -----------------------------------------------------------------------------------------------

	let svgMain = d3.select("#div_id_main")
					.append("svg")	
						.attr("id", "svg_id_main");

	let svgAll = svgMain.append("g")
							.attr("id", "g_id_all");

	//let d3_curve_type = d3.curveLinear;//d3.curveMonotoneX;//d3.curveLinear; //d3.curveBasis;

	for (let nType = 0; nType < vDataType.length; nType++) {

		vDataType[nType].fscale_rel = d3.line()
											.x(function(d_date) 
												{ 
													return fScale_Date_PX(getDateCount(sDate_Min, d_date.date)); 
												})
											.y(function(d_date) 
												{ 
													let nCount = 0;

													switch (nType) {

														case DATA_TYPE_TOTAL_CASES: 	{ nCount = d_date.total_cases; break; }
														case DATA_TYPE_NEW_CASES: 		{ nCount = d_date.new_cases; break; }
														case DATA_TYPE_TOTAL_DEATHS: 	{ nCount = d_date.total_deaths; break; }
														case DATA_TYPE_NEW_DEATHS: 		{ nCount = d_date.new_deaths; break; }
													}

													return funcGetSVGMain_PX(ALL_HEIGHT) - fScale_Total_PX(nCount); 
												})
											.curve(d3LineInterpolate);

		vDataType[nType].line.push(
			[
				vDataType[nType].fscale_rel(g_dsDate)
			]);
	}

	// -----------------------------------------------------------------------------------------------

	funcDraw_AllDates(svgAll, g_dsDate, 
						fScale_All, 
						fScale_Date_PT,
						fScale_Total_PX,
						vDataType);

	svgAll.append("text")
					.attr("id", "text_id_date_title")
					.attr("class", "font_size_10 color_main")
					.attr("text-anchor", "start");

	svgAll.append("line")
					.attr("id", "line_id_date_select")
					.attr("class", "color_main");

	for (let idx in g_vTotalIndex) {

		idx_s = parseInt(idx) + 1;
	
		svgAll.append("text")
					.attr("id", "text_id_total_index_" + idx_s)
					.attr("class", "text_class_ruler font_size_10 color_main")
					.attr("text-anchor", "end");
	}

	funcDraw_AllCountryTitle(svgAll, g_dsTouristsJOSM,
						  fScale_Date_PT, 
						  fScale_Total_PX, 
						  fScale_All);

	$("#div_id_main").css("height", "400pt");
	$("#svg_id_main").css("height", "400pt");
}

function funcDraw_CountriesDisplay_All(divOptions) {

	for (let nType = 0; nType < vDataType.length; nType++) {

		divOptions.append("span")
					.attr("id", "span_id_path_" + vDataType[nType].id_name + "_display")
					.attr("class", "span_class_path_display span_class_options font_size_10")
					.text(vDataType[nType].field_name);

		d3.select("#span_id_path_" + vDataType[nType].id_name + "_display")
				.style("border-color", vDataType[nType].color);

		let cColor = (vDataType[nType].path_display) ? COLOR_BACKGROUND : vDataType[nType].color;
		let cBorderColor = (vDataType[nType].path_display) ? vDataType[nType].color : COLOR_BACKGROUND;

		d3.select("#span_id_path_" + vDataType[nType].id_name + "_display")
				.style("color", cColor)
				.style("background-color", cBorderColor)

		$("#span_id_path_" + vDataType[nType].id_name + "_display").mouseover(function() {
  
  			if (!vDataType[nType].path_display) {
				$(this).css("color", COLOR_BACKGROUND)
						.css("background-color", vDataType[nType].color);
  			}
		});

		$("#span_id_path_" + vDataType[nType].id_name + "_display").mouseout(function() {
  
  			if (!vDataType[nType].path_display) {
				$(this).css("color", vDataType[nType].color)
						.css("background-color", COLOR_BACKGROUND);
			}
		});

		$("#span_id_path_" + vDataType[nType].id_name + "_display").click(function() {

			vDataType[nType].path_display = !vDataType[nType].path_display;

			{
				let fOpacity = (vDataType[nType].path_display) ? 1 : 0;

				d3.selectAll(".path_" + vDataType[nType].id_name)
					.attr("stroke-opacity", fOpacity);
			}

			{
				let cColor = (vDataType[nType].path_display) ? COLOR_BACKGROUND : vDataType[nType].color;
				let cBorderColor = (vDataType[nType].path_display) ? vDataType[nType].color : COLOR_BACKGROUND;

				d3.select("#span_id_path_" + vDataType[nType].id_name + "_display")
						.style("color", cColor)
						.style("background-color", cBorderColor)
			}

			// -------

			funcDraw_All();
		});
	}
}

function funcDraw_LineType_All(divOptions) {
	
	divOptions.append("span")
				.attr("id", "span_id_options_line_type_all")
				.attr("class", "span_class_options font_size_10 color_main")
				.text((g_nLineType == 0) ? "Show Curve" : "Show Straight");

	$('#span_id_options_line_type_all').click(function() { 

		g_nLineType = (g_nLineType == 0) ? 1 : 0;

		if (g_nLineType == 1) {

			$(this).html("Show Straight");

		} else {

			$(this).html("Show Curve");
		}

		funcDraw_All();
	});
}

function funcDraw_AllDates(svgAll, d, 
							 fScale_All, 
							 fScale_Date_PT,
							 fScale_Total_PX,
						   	 vDataType) {

	let stroke_opacity_s = 1.0;//0.8;
	let stroke_opacity_e = 1.0;//0.6;

	let monthes = g_nAllCountrysCount;
	
	// -------

	let svgDates = svgAll.append("svg")
								.attr("id", "svg_id_all_visitors")
								.attr("class", "svg_class_monthes")
								.attr("width", MAIN_WIDTH + "pt")
								.attr("height", (ALL_HEIGHT * 2) + "pt")
								.attr("x", 0 + "pt")
								.attr("y", fScale_All(0) + "pt");

	{
		svgDates.append("line")
						.attr("id", "line_id_zero")
						.attr("class", "color_main")
						.attr("x1", fScale_Date_PT(getDateCount(sDate_Min, d[0].date)) + "pt")
						.attr("y1", function(d_date) { return (ALL_HEIGHT) + "pt"; })
						.attr("x2", fScale_Date_PT(getDateCount(sDate_Min, d[d.length - 1].date)) + "pt")
						.attr("y2", function(d_date) { return (ALL_HEIGHT) + "pt"; });
	}

	// -------

	for (let nType = 0; nType < vDataType.length; nType++) {

		//if (vDataType[nType].path_display) {

			let fStrokeOpacity = (vDataType[nType].path_display) ? 1 : 0

			svgDates.append("path")
						.attr("class", ("path_" + vDataType[nType].id_name) + " " + vDataType[nType].class_name_path + " " + vDataType[nType].class_name_color)
						.attr("d", vDataType[nType].line[0][0])
						.attr("stroke-opacity", fStrokeOpacity);
		//}
	}

	// -------

	svgDates.selectAll("circle.circle_class_date_all")
		.data(d)
		.enter()
			.append("circle")
				.attr("class", "color_main circle_class_date_all")
				.attr("cx", function(d_date) { return fScale_Date_PT(getDateCount(sDate_Min, d_date.date)) + "pt"; })
				.attr("cy", function(d_date) { return (ALL_HEIGHT) + "pt"; })
				.attr("opacity", 0)
				.attr("r", 0.5 + "pt");
			
	// ------- 

	svgDates.selectAll("line.month_all")
		.data(d)
		.enter()
			.append("line")
				.attr("class", "line_class_month color_main month_all")
				.attr("x1", function(d_date) { return fScale_Date_PT(getDateCount(sDate_Min, d_date.date)) + "pt"; })
				.attr("y1", function(d_date) { return ALL_HEIGHT + "pt"; })
				.attr("x2", function(d_date) { return fScale_Date_PT(getDateCount(sDate_Min, d_date.date)) + "pt"; })
				.attr("y2", function(d_date) { return 0 + "pt"; })
				.on("mouseover", function (d_date) {

					showMonthCircles_All();

					let formatNumStr = d3.format(",");
					let formatPercent = d3.format(".2p");

					let pt_x = fScale_Date_PT(getDateCount(sDate_Min, d_date.date));

					let text_anchor = (pt_x < MAIN_WIDTH / 2) ? "start" : "end";
					let text_anchor_rev = (pt_x < MAIN_WIDTH / 2) ? "end" : "start";
					let pt_x_text = pt_x;//pt_x + ((pt_x < MAIN_WIDTH / 2) ? 5 : -5);
					let pt_x_text_rev = pt_x + ((pt_x < MAIN_WIDTH / 2) ? -5 : 5);

					d3.select("#line_id_date_select")
						.attr("x1", pt_x + "pt")
						.attr("y1", fScale_All(0) + "pt")
						.attr("x2", pt_x + "pt")
						.attr("y2", fScale_All(0) + ALL_HEIGHT + "pt");

					let formatS = d3.format("s");

					for (let idx in g_vTotalIndex) {

						let idx_s = parseInt(idx) + 1;

						if (g_vTotalIndex[idx] < g_nTotalCasesCount_Max) {
							//y = (fScale_All(0) + ALL_HEIGHT - funcGetSVGMain_PT(fScale_Total_PX(g_vTotalIndex[idx])));
						} else if (idx_s == 1) {
							//g_vTotalIndex[idx] = g_nTotalCasesCount_Max / (idx_s + 1);
						} else {
							break;
						}
							
						y = (fScale_All(0) + ALL_HEIGHT - funcGetSVGMain_PT(fScale_Total_PX(g_vTotalIndex[idx])));
						text = formatS(g_vTotalIndex[idx]);

						text = text.replace(".00000", "")
						text = text.replace(".0000", "")
						text = text.replace(".000", "")
						text = text.replace( "50000k", "5k")

						//let y = (fScale_All(0) + ALL_HEIGHT - funcGetSVGMain_PT(fScale_Total_PX(g_vTotalIndex[idx])));
						//let text = formatS(g_vTotalIndex[idx]);

						d3.select("#text_id_total_index_" + idx_s)
							.attr("x", pt_x + ((pt_x < MAIN_WIDTH / 2) ? 5 : -5) + "pt")
							.attr("y", (y + 4) + "pt")
							.attr("text-anchor", text_anchor)
							.text(text);
					}

					d3.select("#text_id_date_title")
						.attr("x", pt_x_text + "pt")
						.attr("y", (fScale_All(0) + ALL_HEIGHT + 12) + "pt")
						.attr("text-anchor", text_anchor)
						.text(d_date.date + " (" + getDayOfWeek(d_date.date) + ")");

					let nTotalCases = d_date.total_cases
					let nNewCases = d_date.new_cases
					let nTotalDeaths = d_date.total_deaths
					let nNewDeaths = d_date.new_deaths

					d3.select("#text_id_date_subtitle").remove();

					svgAll.append("text")
									.attr("id", "text_id_date_subtitle")
									.attr("class", "font_size_10 color_main")
									.attr("x", pt_x_text + "pt")
									.attr("y", (fScale_All(0) + ALL_HEIGHT + 25) + "pt")
									.attr("text-anchor", text_anchor)
										.append("tspan")
											.text((vDataType[DATA_TYPE_TOTAL_CASES].path_display) ? formatNumStr(nTotalCases) + " " : "")
											.attr("fill", vDataType[DATA_TYPE_TOTAL_CASES].color)
										.append("tspan")
											.text((vDataType[DATA_TYPE_NEW_CASES].path_display) ? "(+" + formatNumStr(nNewCases) + ") " : "")
											.attr("fill", vDataType[DATA_TYPE_NEW_CASES].color)
										.append("tspan")
											.text((vDataType[DATA_TYPE_TOTAL_CASES].path_display || vDataType[DATA_TYPE_NEW_CASES].path_display) ? "cases" : "")
											.attr("fill", vDataType[DATA_TYPE_TOTAL_CASES].color)

					d3.select("#text_id_date_subtitle_2").remove();

					svgAll.append("text")
									.attr("id", "text_id_date_subtitle_2")
									.attr("class", "font_size_10 color_main")
									.attr("x", pt_x_text + "pt")
									.attr("y", (fScale_All(0) + ALL_HEIGHT + 36) + "pt")
									.attr("text-anchor", text_anchor)
										.append("tspan")
											.text((vDataType[DATA_TYPE_TOTAL_DEATHS].path_display) ? formatNumStr(nTotalDeaths) + " " : "")
											.attr("fill", vDataType[DATA_TYPE_TOTAL_DEATHS].color)
										.append("tspan")
											.text((vDataType[DATA_TYPE_NEW_DEATHS].path_display) ? "(+" + formatNumStr(nNewDeaths) + ") " : "")
											.attr("fill", vDataType[DATA_TYPE_NEW_DEATHS].color)
										.append("tspan")
											.text((vDataType[DATA_TYPE_TOTAL_DEATHS].path_display || vDataType[DATA_TYPE_NEW_DEATHS].path_display) ? "cases" : "")
											.attr("fill", vDataType[DATA_TYPE_TOTAL_DEATHS].color)
			    })
				.on("mouseout", function (d_date) {

					hideMonthCircles_All();
			    });

	// ----------------------------

	let vMonths_first = g_dsDate.filter(function (d) {  return (d.date.substring(8, 10) == "01") })

	for (let i in vMonths_first) {

		let nDateCount = getDateCount(vMonths_first[0].date, vMonths_first[i].date)

		svgDates.append("text")
					.attr("class", "text_class_date_year_all font_size_10 color_main")
					.attr("x", fScale_Date_PT(nDateCount) + "pt")
					.attr("y", ALL_HEIGHT + 12 + "pt")
					.text(getMonthBriefText(parseInt(vMonths_first[i].date.substring(5, 7))));
	}
}

function funcDraw_AllCountryTitle(svgAll, d, 
								fScale_Date_PT, 
								fScale_Total_PX, 
								fScale_All) {

	let padding_top = 40;
	let text_spacing = 18;
	let title_font_size = 10;

	let text_x = PADDING_LEFT;
	let text_y = fScale_All(0) + padding_top;

	let formatNumStr = d3.format(",");
	let formatPercent = d3.format(".2p");

	svgCountry_title = svgAll.append("g")
								.attr("class", "country_title")
								.on("mouseover", function (d_date) {

									showMonthCircles_All();
								})
								.on("mouseout", function (d_date) {

									hideMonthCircles_All();
							    });

	// draw text
	{
		svgCountry_title.append("text")
							.attr("class", "text_class_country_title font_size_16 color_main")
							.attr("x", text_x + "pt")
							.attr("y", text_y + title_font_size + "pt") 
							.text(g_dsDate[0].date + " ~ " + g_dsDate[g_dsDate.length - 1].date);

		svgCountry_title.append("text")
							.attr("class", "text_class_date_subtitle font_size_12 color_total_cases")
							.attr("x", text_x + "pt")
							.attr("y", text_y + title_font_size + text_spacing + "pt") 
							.text(formatNumStr(d3.max(g_dsDate, function (d) { return d.total_cases; })) + " cases");

		svgCountry_title.append("text")
							.attr("class", "text_class_date_subtitle font_size_12 color_total_deaths")
							.attr("x", text_x + "pt")
							.attr("y", text_y + title_font_size + text_spacing + text_spacing + "pt") 
							.text(formatNumStr(d3.max(g_dsDate, function (d) { return d.total_deaths; })) + " deaths");
	}
}

function showMonthCircles_All() {

	d3.selectAll("circle.circle_class_date_all")
		.attr("opacity", 0.4);

	//d3.selectAll("text.text_class_date_year_all")
	//	.attr("opacity", 0.4);
}

function hideMonthCircles_All() {

	d3.selectAll("circle.circle_class_date_all")
		.attr("opacity", 0);

	//d3.selectAll("text.text_class_date_year_all")
	//	.attr("opacity", 0);

	d3.select("#text_id_date_title")
		.attr("x", -100 + "pt")
		.attr("y", -100 + "pt");

	d3.select("#text_id_date_subtitle")
		.attr("x", -100 + "pt")
		.attr("y", -100 + "pt");

	d3.select("#text_id_date_subtitle_2")
		.attr("x", -100 + "pt")
		.attr("y", -100 + "pt");

	d3.select("#line_id_date_select")
		.attr("x1", -100 + "pt")
		.attr("y1", -100 + "pt")
		.attr("x2", -100 + "pt")
		.attr("y2", -100 + "pt");

	d3.selectAll(".text_class_ruler")
		.attr("x", -100 + "pt")
		.attr("y", -100 + "pt");
}
