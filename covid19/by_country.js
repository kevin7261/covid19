
var fScale_Country;
var fScale_Date_PT;
var fScale_Date_PX;
var fScale_Total_PX;

var vCountryRulerMax = [];
var vfScale_Total_PX_Country = [];

var g_fHeightScale = 0.95;

var g_nTotalCasesCount_Max = 0;

var vMonths_first = []

function funcDraw_ByCountry_Main() {
	
	for (let i in g_dsCountries) {

		g_vDisplayMode.push(0);
	}

	// -----------------------------------------

	let d3LineInterpolate = (g_nLineType == 0) ? d3.curveLinear : d3.curveMonotoneX;

	sDate_Min = d3.min(g_dsAll, function (d) { return d.ymd; }).toString();//"191231"; 
	sDate_Max = d3.max(g_dsAll, function (d) { return d.ymd; }).toString();//"200728";

	sDate_Min = sDate_Min.substring(0, 4) + "-" + sDate_Min.substring(4, 6) + "-" + sDate_Min.substring(6, 8)
	sDate_Max = sDate_Max.substring(0, 4) + "-" + sDate_Max.substring(4, 6) + "-" + sDate_Max.substring(6, 8)

	let nDate_Count = getDateCount(sDate_Min, sDate_Max) + 1;

	g_nTotalCasesCount_Max = 0;//d3.max(g_dsAll, function (d) { return d.total_cases; });
	
	for (let nType = 0; nType < vDataType.length; nType++) {

		if (vDataType[nType].path_display) {
		
			let nCount = d3.max(g_dsAll, vDataType[nType].data);

			if (g_nTotalCasesCount_Max < nCount)
				g_nTotalCasesCount_Max = nCount;
		}
	}

	// -------

	let nIndexTop = d3.format(".1r")(g_nTotalCasesCount_Max)

	g_vTotalIndex = [];

	var nIntervalCount = 2;

	for (let i = 1; i <= nIntervalCount; i++) {

		g_vTotalIndex.push(nIndexTop / nIntervalCount * i)
	}

	// ---------------------------------------------------------------

	fScale_Country = d3.scaleLinear()
							.domain([0, g_dsCountries.length])
							.range([0, COUNTRY_HEIGHT * g_dsCountries.length]);

	fScale_Date_PT = d3.scaleLinear()
							.domain([1, nDate_Count])
							.range([0, MAIN_WIDTH]);

	fScale_Date_PX = d3.scaleLinear()
							.domain([1, nDate_Count])
							.range([0, funcGetSVGMain_PX(MAIN_WIDTH)]);

	fScale_Total_PX = d3.scaleLinear()
							//.domain([0, g_nTotalCasesCount_Max / 100])//
							.domain([0, g_nTotalCasesCount_Max * 0.85])
							.range([0, funcGetSVGMain_PX(COUNTRY_HEIGHT * g_fHeightScale)]);

	// ---------------------------------------------------------------

	let divOptions_Background = d3.select("#div_id_page_options_background");

	let divOptions = divOptions_Background.append("div")
												.attr("id", "div_id_page_options");

	funcDraw_CountriesDisplay(divOptions);

	displayOptions(g_bShowOptions = false);

	funcDraw_DisplayMode(divOptions);

	funcDraw_LineType(divOptions);

	funcDraw_CountriesPanel(divOptions);

	// -----------------------------------------------------------------------------------------------

	let svgMain = d3.select("#div_id_main")
					.append("svg")	
						.attr("id", "svg_id_main");

	let svgCountries = svgMain.append("g")
						.attr("id", "g_id_countries");

	//let d3_curve_type = d3.curveLinear;//d3.curveMonotoneX;//d3.curveLinear; //d3.curveBasis;

	for (let nType = 0; nType < vDataType.length; nType++) {

		vDataType[nType].fscale_rel = d3.line()
											.x(function(d_date) { return fScale_Date_PX(getDateCount(sDate_Min, d_date.date)); })
											.y(function(d_date) { return funcGetSVGMain_PX(COUNTRY_HEIGHT) - fScale_Total_PX(vDataType[nType].data(d_date)); })
												.curve(d3LineInterpolate);
	}

	g_dsCountries.forEach(function(d, i) {

		let dsCountry = d.values.sort(function(a, b) { return d3.ascending(a.date, b.date); });

		if (dsCountry.length == 0)
			return;

		// -------

		//let nTotal_Max_Country = d3.max(dsCountry, function (d_date) { return d_date.total; });

		let	nTotal_Max_Country = 0;
	
		for (let nType = 0; nType < vDataType.length; nType++) {

			if (vDataType[nType].path_display) {
			
				let nCount = d3.max(dsCountry, vDataType[nType].data);

				if (nTotal_Max_Country < nCount)
					nTotal_Max_Country = nCount;
			}
		}

		let nCountryRulerMax = 0;

		for (let x = 1; x <= 10; x++)
		{
			nCountryRulerMax = Math.pow(10, x - 1);

			if (nTotal_Max_Country < nCountryRulerMax) {

				for (let y = 0; y < 3; y++) {
					
					let ruler_this = nCountryRulerMax;

					if (nTotal_Max_Country < ruler_this * (3 / 4)) 
						nCountryRulerMax = ruler_this * (3 / 4);
					else
						break;
					
					if (nTotal_Max_Country < ruler_this * (2 / 4)) 
						nCountryRulerMax = ruler_this * (2 / 4);
					else
						break;
					
					if (nTotal_Max_Country < ruler_this * (1 / 4)) 
						nCountryRulerMax = ruler_this * (1 / 4);
					else
						break;

				}

				break;
			}
		}

		vCountryRulerMax.push(nCountryRulerMax);

		let fScale_Total_PX_Country = d3.scaleLinear()
												.domain([0, nTotal_Max_Country])
												.range([0, funcGetSVGMain_PX(COUNTRY_HEIGHT * g_fHeightScale)]);

		vfScale_Total_PX_Country.push(fScale_Total_PX_Country);

		for (let nType = 0; nType < vDataType.length; nType++) {

			vDataType[nType].fscale_ind = d3.line()
												.x(function(d_date) { return fScale_Date_PX(getDateCount(sDate_Min, d_date.date)); })
												.y(function(d_date) { return funcGetSVGMain_PX(COUNTRY_HEIGHT) - fScale_Total_PX_Country(vDataType[nType].data(d_date)); })
													.curve(d3LineInterpolate);
		
			vDataType[nType].line.push(
				[
					vDataType[nType].fscale_rel(dsCountry), 
					vDataType[nType].fscale_ind(dsCountry)
				]);
		}
	});

	g_dsCountries.forEach(function(d, i) {

		funcDraw_Countries(svgCountries, d, i, 
								fScale_Country, 
								fScale_Date_PT,
								fScale_Total_PX,
								vfScale_Total_PX_Country[i],
							    vDataType,
								vCountryRulerMax[i]);
	});

	svgCountries.append("text")
					.attr("id", "text_id_date_title")
					.attr("class", "font_size_10 color_main")
					.attr("text-anchor", "start");

	svgCountries.append("line")
					.attr("id", "line_id_date_select")
					.attr("class", "color_main");

	for (let idx in g_vTotalIndex) {

		idx_s = parseInt(idx) + 1;
	
		svgCountries.append("text")
						.attr("id", "text_id_total_index_" + idx_s)
						.attr("class", "text_class_ruler font_size_10 color_main")
						.attr("text-anchor", "end");
	}

	g_dsCountries.forEach(function(d, i) {

		funcDraw_CountryTitle(svgCountries, d, i, 
							   fScale_Date_PT, 
							   fScale_Total_PX, 
							   vfScale_Total_PX_Country[i], 
							   fScale_Country, 
							   vDataType[DATA_TYPE_TOTAL_CASES].line[i],//vLineTotal[i], 
							   vCountryRulerMax[i]);
	});

	$("#div_id_main").css("height", (g_dsCountries.length * COUNTRY_HEIGHT + 100) + "pt");
	$("#svg_id_main").css("height", (g_dsCountries.length * COUNTRY_HEIGHT + 100) + "pt");
}

function funcDraw_CountriesDisplay(divOptions) {

	divOptions.append("span")
				.attr("id", "span_id_countries_display")
				.attr("class", "span_class_options font_size_10");

	$('#span_id_countries_display').click(function() { 
	
		g_bShowOptions = !g_bShowOptions;

		displayOptions(g_bShowOptions);
	});

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

			funcDraw_ByCountry();
		});
	}
}

function funcDraw_DisplayMode(divOptions) {
	
	divOptions.append("span")
				.attr("id", "span_id_options_display_mode")
				.attr("class", "span_class_options font_size_10 color_main")
				.text((g_nDisplayMode == 0) ? "Show Individual" : "Show Relative");
	/*			
	d3.select("#span_id_options_display_mode")
			.style("color", COLOR_MAIN)
			.style("background-color", COLOR_BACKGROUND);
	*/

	$('#span_id_options_display_mode').click(function() { 

		g_nDisplayMode = (g_nDisplayMode == 0) ? 1 : 0;

		if (g_nDisplayMode == 1) {

			$(this).html("Show Relative");

  			//$(this).css({"color": COLOR_BACKGROUND,
  			//			 "background-color": COLOR_MAIN});

		} else {

			$(this).html("Show Individual");

  			//$(this).css({"color": COLOR_MAIN,
  			//			 "background-color": COLOR_BACKGROUND});
		}

		g_dsCountries.forEach(function(d, i) {

			g_vDisplayMode[i] = g_nDisplayMode;

			let svgCountries = d3.select("#g_id_countries");

			funcDraw_Countries(svgCountries, d, i, 
									fScale_Country, 
									fScale_Date_PT,
									fScale_Total_PX,
									vfScale_Total_PX_Country[i],
									vDataType,
									vCountryRulerMax[i]);

			funcDraw_CountryTitle(svgCountries, d, i, 
								   fScale_Date_PT, 
								   fScale_Total_PX, 
								   vfScale_Total_PX_Country[i],
								   fScale_Country, 
									vDataType[DATA_TYPE_TOTAL_CASES].line[i],
								   vCountryRulerMax[i]);
		});	
	});
}

function funcDraw_LineType(divOptions) {
	
	divOptions.append("span")
				.attr("id", "span_id_options_line_type")
				.attr("class", "span_class_options font_size_10 color_main")
				.text((g_nLineType == 0) ? "Show Curve" : "Show Straight");
	/*			
	d3.select("#span_id_options_display_mode")
			.style("color", COLOR_MAIN)
			.style("background-color", COLOR_BACKGROUND);
	*/

	$('#span_id_options_line_type').click(function() { 

		g_nLineType = (g_nLineType == 0) ? 1 : 0;

		if (g_nLineType == 1) {

			$(this).html("Show Straight");

  			//$(this).css({"color": COLOR_BACKGROUND,
  			//			 "background-color": COLOR_MAIN});

		} else {

			$(this).html("Show Curve");

  			//$(this).css({"color": COLOR_MAIN,
  			//			 "background-color": COLOR_BACKGROUND});
		}

		funcDraw_ByCountry();
	});
}

function funcDraw_CountriesPanel(divOptions) {

	let width = 0;
	let divOptions_Sub = divOptions.append("div")
										.attr("class", "div_class_countries_panel");

	$('.div_class_countries_panel').hide();

	g_dsCountries.forEach(function(d, i) {

		let sClassName = d.values[0].abbreviation;
		let sCountry = d.values[0].location;

		let divOptions_Sub_a = divOptions_Sub.append("a")
												.attr("class", "a_class_option")
												.on("click",function() {

							    					$(document).scrollTop($("#a_id_country_" + sClassName).offset().top - 475);  
												});
		
		divOptions_Sub_a_span = divOptions_Sub_a.append("span")
													.attr("id", "span_id_country_" + sClassName)
													.attr("class", "");
		
		divOptions_Sub_a_span.append("span")
								.attr("class", "span_class_country_text font_size_12 color_main")
								.text(sCountry);

		px = document.getElementById("span_id_country_" + sClassName).offsetWidth;
		pt = funcGetSVGMain_PT(px);

		width += (pt + 3);

		if (width > 800 - (50 * 2) - 175)
		{
			width = 0;
		}
	});
}

function funcDraw_Countries(svgCountries, d, i, 
							 fScale_Country, 
							 fScale_Date_PT,
							 fScale_Total_PX,
							 fScale_Total_PX_Country,
						   	 vDataType,
							 vCountryRulerMax) {

	let sClassName = d.values[0].abbreviation;
	let sCountry = d.values[0].location;

	let idx_s = 1;
	let idx_e = 0;
	let stroke_opacity_s = 1.0;//0.8;
	let stroke_opacity_e = 1.0;//0.6;

	if (g_vDisplayMode[i] == 0)
	{
		idx_s = 1;
		idx_e = 0;

		stroke_opacity_s = 1.0;//0.8;
		stroke_opacity_e = 1.0;//0.6;
	}
	else
	{
		idx_s = 0;
		idx_e = 1;

		stroke_opacity_s = 1.0;//0.6;
		stroke_opacity_e = 1.0;//0.8;
	}

	if (d.values.length == 0)
		return;

	let monthes = d.values;
	// -------

	d3.select("#svg_id_dates_" + sClassName).remove();

	let svgDates = svgCountries.append("svg")
									.attr("id", "svg_id_dates_" + sClassName)
									.attr("class", "svg_class_monthes")
									.attr("width", MAIN_WIDTH + "pt")
									.attr("height", (COUNTRY_HEIGHT * 2) + "pt")
									.attr("x", 0 + "pt")
									.attr("y", fScale_Country(i) + "pt");

	{
		svgDates.append("line")
						.attr("id", "line_id_zero")
						.attr("class", "color_main")
						.attr("x1", fScale_Date_PT(getDateCount(sDate_Min, d.values[0].date)) + "pt")
						.attr("y1", function(d_date) { return (COUNTRY_HEIGHT) + "pt"; })
						.attr("x2", fScale_Date_PT(getDateCount(sDate_Min, d.values[d.values.length - 1].date)) + "pt")
						.attr("y2", function(d_date) { return (COUNTRY_HEIGHT) + "pt"; });
	}

	// -------

	for (let nType = 0; nType < vDataType.length; nType++) {

		//if (vDataType[nType].path_display) {

			let fStrokeOpacity = (vDataType[nType].path_display) ? 1 : 0;

			svgDates.append("path")
						.attr("class", ("path_" + vDataType[nType].id_name) + " " + vDataType[nType].class_name_path + " " + vDataType[nType].class_name_color)
						.attr("d", vDataType[nType].line[i][idx_s])
						.attr("stroke-opacity", fStrokeOpacity)//.attr("stroke-opacity", stroke_opacity_s)
						.transition()
						.duration(PATH_TRANSLATION_TIME)
						.attr("d", vDataType[nType].line[i][idx_e])
						.attr("stroke-opacity", fStrokeOpacity)//.attr("stroke-opacity", stroke_opacity_e);
		//}
	}

	// -------

	svgDates.selectAll("circle.circle_class_date_" + sClassName)
		.data(monthes)
		.enter()
			.append("circle")
				.attr("class", "color_main circle_class_date_" + sClassName)
				.attr("cx", function(d_date) { return fScale_Date_PT(getDateCount(sDate_Min, d_date.date)) + "pt"; })
				.attr("cy", function(d_date) { return (COUNTRY_HEIGHT) + "pt"; })
				.attr("opacity", 0)
				.attr("r", 0.5 + "pt");
			
	// ------- 

	//let nCountryTotal_Max = d3.max(monthes, function (d_date) { return d_date.total; })

	let nCountryTotal_Max = 0;

	for (let nType = 0; nType < vDataType.length; nType++) {

		if (vDataType[nType].path_display) {
		
			let nCount = d3.max(monthes, vDataType[nType].data);

			if (nCountryTotal_Max < nCount)
				nCountryTotal_Max = nCount;
		}
	}

	svgDates.selectAll("line.month_" + sClassName)
		.data(monthes)
		.enter()
			.append("line")
				.attr("class", "line_class_month color_main month_" + sClassName)
				.attr("x1", function(d_date) { return fScale_Date_PT(getDateCount(sDate_Min, d_date.date)) + "pt"; })
				.attr("y1", function(d_date) { return COUNTRY_HEIGHT + "pt"; })
				.attr("x2", function(d_date) { return fScale_Date_PT(getDateCount(sDate_Min, d_date.date)) + "pt"; })
				.attr("y2", function(d_date) { return 0 + "pt"; })
				.on("mouseover", function (d_date) {

					showMonthCircles(sClassName);

					showDislikeRatio(sClassName);

					let formatNumStr = d3.format(",");
					let formatPercent = d3.format(".2p");

					let pt_x = fScale_Date_PT(getDateCount(sDate_Min, d_date.date));

					let text_anchor = (pt_x < MAIN_WIDTH / 2) ? "start" : "end";
					let text_anchor_rev = (pt_x < MAIN_WIDTH / 2) ? "end" : "start";
					let pt_x_text = pt_x;//pt_x + ((pt_x < MAIN_WIDTH / 2) ? 5 : -5);
					let pt_x_text_rev = pt_x + ((pt_x < MAIN_WIDTH / 2) ? -5 : 5);

					d3.select("#line_id_date_select")
						.attr("x1", pt_x + "pt")
						.attr("y1", fScale_Country(i) + "pt")
						.attr("x2", pt_x + "pt")
						.attr("y2", fScale_Country(i) + COUNTRY_HEIGHT + "pt");

					let formatS = d3.format("s");

					for (let idx in g_vTotalIndex) {

						idx_s = parseInt(idx) + 1;

						d3.select("#text_id_total_index_" + idx_s).text("")

						let y, text;

						if (g_vDisplayMode[i] == 0) {

							if (g_vTotalIndex[idx] < g_nTotalCasesCount_Max) {
								//y = (fScale_Country(i) + COUNTRY_HEIGHT - funcGetSVGMain_PT(fScale_Total_PX(g_vTotalIndex[idx])));
							} else if (idx_s == 1) {
								//g_vTotalIndex[idx] = g_nTotalCasesCount_Max / (idx_s + 1);
							} else {
								break;
							}

							text = formatS(g_vTotalIndex[idx]);

							text = text.replace(".50000", ".5")
							text = text.replace(".5000", ".5")
							text = text.replace( "5000k", "5k")
							text = text.replace( "500k", "5k")
							text = text.replace(".00000", "")
							text = text.replace(".0000", "")
							text = text.replace(".000", "")

							y = (fScale_Country(i) + COUNTRY_HEIGHT - funcGetSVGMain_PT(fScale_Total_PX(g_vTotalIndex[idx])));

						} else {

							let value = parseInt(vCountryRulerMax / g_vTotalIndex.length * idx_s)

							y = (fScale_Country(i) + COUNTRY_HEIGHT - funcGetSVGMain_PT(fScale_Total_PX_Country(value)));
							text = ""

							if (value < nCountryTotal_Max * 1.2) {

								text = formatS(value);

								text = text.replace(".50000", ".5")
								text = text.replace(".5000", ".5")
								text = text.replace( "5000k", "5k")
								text = text.replace( "500k", "5k")
								text = text.replace(".00000", "")
								text = text.replace(".0000", "")
								text = text.replace(".000", "")
							}
						}

						if (text != "") {

							d3.select("#text_id_total_index_" + idx_s)
								.attr("x", pt_x + ((pt_x < MAIN_WIDTH / 2) ? 5 : -5) + "pt")
								.attr("y", (y + 4) + "pt")
								.attr("text-anchor", text_anchor)
								.text(text);
						}
					}

					d3.select("#text_id_date_title")
						.attr("x", pt_x_text + "pt")
						.attr("y", (fScale_Country(i) + COUNTRY_HEIGHT + 12) + "pt")
						.attr("text-anchor", text_anchor)
						.text(d_date.date + " (" + getDayOfWeek(d_date.date) + ")");

					let nTotalCases = d_date.total_cases
					let nNewCases = d_date.new_cases
					let nTotalDeaths = d_date.total_deaths
					let nNewDeaths = d_date.new_deaths

					d3.select("#text_id_date_subtitle").remove();

					svgCountries.append("text")
									.attr("id", "text_id_date_subtitle")
									.attr("class", "font_size_10 color_main")
									.attr("x", pt_x_text + "pt")
									.attr("y", (fScale_Country(i) + COUNTRY_HEIGHT + 25) + "pt")
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

					svgCountries.append("text")
									.attr("id", "text_id_date_subtitle_2")
									.attr("class", "font_size_10 color_main")
									.attr("x", pt_x_text + "pt")
									.attr("y", (fScale_Country(i) + COUNTRY_HEIGHT + 36) + "pt")
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

					hideMonthCircles(sClassName);
			    });

	// ----------------------------

	vMonths_first = g_dsDate.filter(function (d) {  return (d.date.substring(8, 10) == "01") })

	for (let i in vMonths_first) {

		let nDateCount = getDateCount(vMonths_first[0].date, vMonths_first[i].date)

		svgDates.append("text")
					.attr("id", "text_id_date_year_" + i + "_" + sClassName)
					.attr("class", "text_class_date_year font_size_10 color_main")
					.attr("x", fScale_Date_PT(nDateCount) + "pt")
					.attr("y", COUNTRY_HEIGHT + 12 + "pt")
					.attr("fill-opacity", 0)
					.text(getMonthBriefText(parseInt(vMonths_first[i].date.substring(5, 7))));
	}
}

function funcDraw_CountryTitle(svgCountries, d, i, 
								fScale_Date_PT, 
								fScale_Total_PX, 
								fScale_Total_PX_Country, 
								fScale_Country, 
								vLineTotal,
								vCountryRulerMax) {

	let sClassName = d.values[0].abbreviation;
	let sCountry = d.values[0].location;
	let sRegion = d.values[0].continent;

	d3.select("#a_id_country_" + sClassName).remove();
	d3.select("#rect_id_date_mode_" + sClassName).remove();
	d3.select("#text_id_date_mode_" + sClassName).remove();

	let padding_top = 45;
	let text_spacing = 18;
	let title_font_size = 10;
	//let subtitle_font_size = 3;
	//let mode_radius = subtitle_font_size;

	let text_x = PADDING_LEFT;
	let text_y = fScale_Country(i) + padding_top;

	let formatNumStr = d3.format(",");
	let formatPercent = d3.format(".2p");

	svgCountry_title = svgCountries.append("a")
										.attr("id", "a_id_country_" + sClassName)
										.attr("target", "_blank")
										.append("g")
											.attr("class", "country_title")
											.on("mouseover", function (d_date) {

												showMonthCircles(sClassName);

												showDislikeRatio(sClassName);
											})
											.on("mouseout", function (d_date) {

												hideMonthCircles(sClassName);

												hideDislikeRatio(sClassName);
										    });

	// draw text
	{
		let title_font_size = 10;
		let nCircleWidth = 32;

/*
		if (d.values[0].index != undefined) {

			let sIndex = parseInt(d.values[0].index) + 1;

			svgCountry_title.append("text")
								.attr("class", "text_class_country_title font_size_12 color_main")
								.attr("text-anchor", "end")
								.attr("x", text_x - 10 + "pt")
								.attr("y", text_y + 7 + "pt") 
								.text("#" + sIndex);
		}
*/

		svgCountry_title.append("circle")
							.attr("class", "circle_class_country color_main")
							.attr("cx", text_x + (nCircleWidth / 2) + "pt")
							.attr("cy", text_y + title_font_size + 3 + "pt") 
							.attr("r", (nCircleWidth / 2) + "pt");

		svgCountry_title.append("text")
							.attr("class", "text_class_region font_size_12 color_main")
							.attr("text-anchor", "middle")
							.attr("x", text_x + (nCircleWidth / 2) + "pt")
							.attr("y", text_y + title_font_size + 8 + "pt") 
							.text(getRegionBriefName(sRegion));

		svgCountry_title.append("text")
							.attr("class", "text_class_country_title font_size_16 color_main")
							.attr("x", text_x + nCircleWidth + title_font_size + "pt")
							.attr("y", text_y + title_font_size + "pt") 
							.text(sCountry);

		svgCountry_title.append("text")
							.attr("class", "text_class_date_subtitle font_size_12")
							.attr("x", text_x + nCircleWidth + title_font_size + "pt")
							.attr("y", text_y + title_font_size + text_spacing + "pt") 
									.append("tspan")
										.text(formatNumStr(d3.max(d.values, function (d) { return d.total_cases; })) + " cases")
										.attr("fill", vDataType[DATA_TYPE_TOTAL_CASES].color)
									.append("tspan")
										.text("　") 
									.append("tspan")
										.text("#" + (parseInt(d.values[0].rank_cases) + 1))
										.attr("fill", vDataType[DATA_TYPE_TOTAL_CASES].color)

		svgCountry_title.append("text")
							.attr("class", "text_class_date_subtitle font_size_12")
							.attr("x", text_x + nCircleWidth + title_font_size + "pt")
								.attr("y", text_y + title_font_size + text_spacing + text_spacing + "pt") 
									.append("tspan")
										.text(formatNumStr(d3.max(d.values, function (d) { return d.total_deaths; })) + " deaths")
										.attr("fill", vDataType[DATA_TYPE_TOTAL_DEATHS].color)
									.append("tspan")
										.text("　") 
									.append("tspan")
										.text("#" + (parseInt(d.values[0].rank_deaths) + 1))
										.attr("fill", vDataType[DATA_TYPE_TOTAL_DEATHS].color)
	}
}

function getRegionBriefName(class_region) {

	let sBrief = "";

	switch (class_region) {

		case "Asia" : sBrief = "AS"; break;
		case "Europe" : sBrief = "EU"; break;
		case "North America" : sBrief = "NA"; break;
		case "South America" : sBrief = "SA"; break;
		case "Africa" : sBrief = "AF"; break;
		case "Oceania" : sBrief = "OC"; break;
	}

	return sBrief;
}

function showMonthCircles(nCountryID) {

	d3.selectAll("circle.circle_class_date_" + nCountryID)
		.attr("opacity", 0.4);

	for (let i in vMonths_first) {

		d3.select("#text_id_date_year_" + i + "_" + nCountryID)
			.attr("fill-opacity", 0.4);
	}
}

function hideMonthCircles(nCountryID) {

	d3.selectAll("circle.circle_class_date_" + nCountryID)
		.attr("opacity", 0);

	for (let i in vMonths_first) {

		d3.select("#text_id_date_year_" + i + "_" + nCountryID)
			.attr("fill-opacity", 0);
	}
}

function showDislikeRatio(nChannelID) {

	d3.select("#rect_id_date_mode_" + nChannelID)
		.attr("fill-opacity", 1)
		.attr("stroke-opacity", 1);

	d3.select("#text_id_date_mode_" + nChannelID)
		.attr("fill-opacity", 1);
}

function hideDislikeRatio(nChannelID) {

	d3.select("#rect_id_date_mode_" + nChannelID)
		.attr("fill-opacity", 0)
		.attr("stroke-opacity", 0);

	d3.select("#text_id_date_mode_" + nChannelID)
		.attr("fill-opacity", 0);

	// ---------

	d3.select("#text_id_date_title")
		.attr("fill-opacity", 0);

	d3.select("#text_id_date_subtitle")
		.attr("fill-opacity", 0);

	d3.select("#text_id_date_subtitle_2")
		.attr("fill-opacity", 0);

	d3.select("#line_id_date_select")
		.attr("stroke-opacity", 0);

	d3.selectAll(".text_class_ruler")
		.attr("fill-opacity", 0);
}

// -----------------------------------------------------

function displayOptions(bShowOptions = true)
{
	let sTitle = "Select Country";

	if (bShowOptions)
	{
		$('#span_id_countries_display').text(sTitle + "　ｘ");

		$('.div_class_countries_panel').show('fast');
	}
	else
	{
		$('#span_id_countries_display').text(sTitle + "　ｖ");

		$('.div_class_countries_panel').hide('fast');
	}
}

// -----------------------------------------------------

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
