
const MAIN_WIDTH = 800; // pt
const COUNTRY_HEIGHT = 150; // pt

const PADDING_LEFT = 50; // pt

const COLOR_BACKGROUND = "#F6F6F6";
const COLOR_MAIN = "#1B3558";

const PATH_TRANSLATION_TIME = 1000;

const DATA_TYPE_TOTAL_CASES = 0;
const DATA_TYPE_NEW_CASES = 1; 
const DATA_TYPE_TOTAL_DEATHS = 2; // total_deaths, conference, exhibition
const DATA_TYPE_NEW_DEATHS = 3;

let vDataType = 
[
	{
		"id": DATA_TYPE_TOTAL_CASES,
		"field_name": "Total Cases",
		"id_name": "total_cases",
		"class_name_path": "path_class_total",
		"class_name_color": "color_total_cases",
		"color": "#1B3558", 
		"data": function(d) { return (d.total_cases == undefined) ? 0 : d.total_cases; }, 
		"fscale_rel": null, 
		"fscale_ind": null, 
		"fscale_per": null, 
		"path_display": true,
		"line": []
	},
	{
		"id": DATA_TYPE_NEW_CASES, 
		"field_name": "New Cases", 
		"id_name": "new_cases",
		"class_name_path": "path_class_except_total",
		"class_name_color": "color_new_cases", 
		"color": "#5d99c6",
		"data": function(d) { return (d.new_cases == undefined) ? 0 : d.new_cases; }, 
		"fscale_rel": null, 
		"fscale_ind": null, 
		"path_display": true,
		"line": []
	},
	{
		"id": DATA_TYPE_TOTAL_DEATHS,
		"field_name": "Total Deaths", 
		"id_name": "total_deaths",
		"class_name_path": "path_class_except_total",
		"class_name_color": "color_total_deaths", 
		"color": "#c41c00",
		"data": function(d) { return (d.total_deaths == undefined) ? 0 : d.total_deaths; }, 
		"fscale_rel": null, 
		"fscale_ind": null, 
		"path_display": true,
		"line": []
	},
	{
		"id": DATA_TYPE_NEW_DEATHS, 
		"field_name": "New Deaths", 
		"id_name": "new_deaths", 
		"class_name_path": "path_class_except_total", 
		"class_name_color": "color_new_deaths", 
		"color": "#ff5730", 
		"data": function(d) { return (d.new_deaths == undefined) ? 0 : d.new_deaths; }, 
		"fscale_rel": null, 
		"fscale_ind": null,
		"path_display": true, 
		"line": []
	},
];

// --------------------------------------------------------------------------------

var g_sIDName_SelectedPage = "";

// --------------------------------------------------------------------------------

var g_dsTouristsJOSM = [];
var g_dsCountries = [];
var g_dsMonthes = [];
var g_dsYears = [];

var nMonth_Min;
var nMonth_Max;

var g_nDisplayMode = 0;
let g_nLineType = 0;
