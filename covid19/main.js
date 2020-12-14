
var g_nAllCountrysCount = 0;

var g_vDisplayMode = [];

var g_vTotalIndex = [];

// -------

var g_bShowOptions = false;

var g_sPage = "";
var g_sCountryIndex = "";

$(document).ready(function(){

});

// -------

function funcLoadData(sFilePath, sFileName, funcAfterLoad, page, country_index) {

	g_sPage = (page != "") ? page : "all";//parseInt(page);
	g_sCountryIndex = (country_index != "") ? country_index : "";//parseInt(page);

	//console.log(g_sPage, g_sCountryIndex)

	let sPathName = g_sFilePath + "/" + g_sFileName + ".json";

	d3.json(sPathName, function(error, data) {
		
		if (error) {
			console.log(error)
			return
		}

		g_dsAll = []

		id = 0

		for (k in data) {

			for (idx in data[k].data) {

				if (k == "OWID_WRL")
					continue

				country = data[k].data[idx]

				country["id"] = id++

				country["ymd"] = parseInt(country.date.substring(0, 4) + country.date.substring(5, 7) + country.date.substring(8, 10))

				//country["year"] = parseInt(country.date.substring(0, 4))
				country["month"] = parseInt(country.date.substring(2, 4) + country.date.substring(5, 7))

				country["m"] = parseInt(country.date.substring(5, 7))
				country["d"] = parseInt(country.date.substring(8, 10))
				
				country["continent"] = data[k].continent
				country["location"] = data[k].location

				country["abbreviation"] = k.toLowerCase()
				country["initial"] = data[k].location.substring(0, 1).toLowerCase()

				g_dsAll.push(country)
			}
		}

		g_dsCountries = d3.nest()
						  	.key(d => d.location)
					  		.entries(g_dsAll)

		// ------------------------------------------------------------------------

		g_dsCountries.sort(function(a, b) {

			return d3.descending(
				d3.sum(a.values, d => d.new_deaths),
				d3.sum(b.values, d => d.new_deaths)); 

		})

		g_dsCountries.forEach(function(d, index) {

			d.values.forEach(function(d) {
				d.rank_deaths = index
			})
		})

		// ------------------------------------

		g_dsCountries.sort(function(a, b) {

			return d3.descending(
				d3.sum(a.values, d => d.new_cases),
				d3.sum(b.values, d => d.new_cases)); 

		})

		g_dsCountries.forEach(function(d, index) {

			d.values.forEach(function(d) {
				d.rank_cases = index
			})
		})

		// ------------------------------------
		
		if (g_sPage == "by_ranking") {

			let rank = g_sCountryIndex.split("-")

			g_dsCountries = g_dsCountries.slice(parseInt(rank[0]) - 1, parseInt(rank[1]))

		} else if (g_sPage == "by_country") {

			g_dsCountries = g_dsCountries.filter(function(d) {

				return g_sCountryIndex.includes(d.values[0].initial)
			})

			g_dsCountries.sort(function(a, b) {

			   return d3.ascending(a.key, b.key);
			})
		}

		g_dsDate = data["OWID_WRL"].data

		//console.log("g_dsAll", g_dsAll)
		//console.log("g_dsCountries", g_dsCountries)
		//console.log("g_dsDate", g_dsDate)

		{
			switch (g_sPage) {
				case "all": 		{ funcPageDisplayControl("span_id_options_all"); break; }
				case "by_ranking": 	{ funcPageDisplayControl("span_id_options_by_ranking_" + g_sCountryIndex); break; }
				case "by_country": 	{ funcPageDisplayControl("span_id_options_by_country_" + g_sCountryIndex); break; }
				case "about_me": 	{ funcPageDisplayControl("span_id_options_about_me"); break; }
			}
		}

		funcAfterLoad();
    });
}

function funcMain() {

	funcInit();

	funcDraw();
}

function funcInit() {

	$('#span_id_options_all').click(function() { 
	
		window.location.href = "index.html?p=all";
	});

	$('#span_id_options_by_ranking_1-50').click(function() 	  	{ window.location.href = "index.html?p=by_ranking&i=1-50"; });
	$('#span_id_options_by_ranking_51-100').click(function()   	{ window.location.href = "index.html?p=by_ranking&i=51-100"; });
	$('#span_id_options_by_ranking_101-150').click(function() 	{ window.location.href = "index.html?p=by_ranking&i=101-150"; });
	$('#span_id_options_by_ranking_151-210').click(function()   { window.location.href = "index.html?p=by_ranking&i=151-210"; });

	$('#span_id_options_by_country_abc').click(function() 	  	{ window.location.href = "index.html?p=by_country&i=abc"; });
	$('#span_id_options_by_country_defghijk').click(function() 	{ window.location.href = "index.html?p=by_country&i=defghijk"; });
	$('#span_id_options_by_country_lmnopqr').click(function() 	{ window.location.href = "index.html?p=by_country&i=lmnopqr"; });
	$('#span_id_options_by_country_stuvwxyz').click(function() 	{ window.location.href = "index.html?p=by_country&i=stuvwxyz"; });


	$('#span_id_options_about_me').click(function() {
	
		window.location.href = "index.html?p=about_me"; 
	
		//funcDraw_AboutMe();
	});

	nMonth_Min = d3.min(g_dsTouristsJOSM, d => d.month);
	nMonth_Max = d3.max(g_dsTouristsJOSM, d => d.month);
}

function funcDraw() {

	funcDraw_Title();

	switch (g_sPage) {
		case "all": 		{ funcDraw_All(); break; }
		case "by_ranking":
		case "by_country": 	{ funcDraw_ByCountry(); break; }
		case "about_me": 	{ funcDraw_AboutMe(); break; }
	}
}

function funcDraw_Title() {

}

function funcDraw_All() {

	d3.select("#div_id_page_options").remove();
	d3.select(".div_class_countries_panel").remove();
	d3.select("#svg_id_main").remove();

	vCountryRulerMax = [];
	vfScale_Total_PX_Country = [];

	for (var i = 0; i < vDataType.length; i++) {
		vDataType[i].line = [];
	}

	funcDraw_All_Main();
}

function funcDraw_ByCountry() {

	d3.select("#div_id_page_options").remove();
	d3.select(".div_class_countries_panel").remove();
	d3.select("#svg_id_main").remove();

	vCountryRulerMax = [];
	vfScale_Total_PX_Country = [];

	for (var i = 0; i < vDataType.length; i++) {
		vDataType[i].line = [];
	}

	funcDraw_ByCountry_Main();

	//displayOptions(false);
}

function funcDraw_AboutMe() {

	d3.select("#div_id_page_options").remove();
	d3.select(".div_class_countries_panel").remove();
	d3.select("#svg_id_main").remove();

	funcDraw_AboutMe_Main();
}
