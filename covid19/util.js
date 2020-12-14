
function getDayOfWeek(date) {

  const dayOfWeek = new Date(date).getDay();

  return isNaN(dayOfWeek) ? null : 
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
    //['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

function getMonthBriefText(m) {

	var month = new Array();

	month[0] = "Jan";
	month[1] = "Feb";
	month[2] = "Mar";
	month[3] = "Apr";
	month[4] = "May";
	month[5] = "Jun";
	month[6] = "Jul";
	month[7] = "Aug";
	month[8] = "Sep";
	month[9] = "Oct";
	month[10] = "Nov";
	month[11] = "Dec";

	return month[m - 1] 
}

function getDateCount(sDate1, sDate2) { // sDate1 和 sDate2 是 2016-06-18 格式
  var aDate, oDate1, oDate2, iDays
  aDate = sDate1.split("/")
  oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]) // 轉換為 06/18/2016 格式
  aDate = sDate2.split("/")
  oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) // 把相差的毫秒數轉換為天數
  return iDays;
};

function getMonthCount(nYearMonth_Start, nYearMonth_End) {

	let nYear_Start = parseInt(nYearMonth_Start.toString().substring(0, 2));
	let nMonth_Start = parseInt(nYearMonth_Start.toString().substring(2, 4));
	let nYear_End = parseInt(nYearMonth_End.toString().substring(0, 2));
	let nMonth_End = parseInt(nYearMonth_End.toString().substring(2, 4));

	let nMonthCount = 0;

	if (nYear_Start == nYear_End) {

		for (let m = nMonth_Start; m < nMonth_End; m++) 
			nMonthCount += 1;

		nMonthCount++;

	} else {

		nMonthCount += ((nYear_End - nYear_Start - 1) * 12);

		for (let m = nMonth_Start; m <= 12; m++)
			nMonthCount += 1;

		for (let m = 1; m <= nMonth_End; m++)
			nMonthCount += 1;
	}

	return nMonthCount;
}

function funcPageDisplayControl(sIDName_SelectedPage) {

	if (g_sIDName_SelectedPage != "") {

		$("#" + g_sIDName_SelectedPage)
				.css("border-bottom-color", COLOR_BACKGROUND);

		$("#" + g_sIDName_SelectedPage)
				.hover(
					function() {
						$(this).css("border-bottom-color", COLOR_MAIN);
					},
					function() {
						$(this).css("border-bottom-color", COLOR_BACKGROUND);
					});
	}

	g_sIDName_SelectedPage = sIDName_SelectedPage;

	$("#" + g_sIDName_SelectedPage).unbind('mouseenter mouseleave')


	$("#" + g_sIDName_SelectedPage)
			.css("border-bottom-color", COLOR_MAIN);
}

// -------------------------------------------------


function funcGetSVGMain_PX(pt)
{
	return pt * (g_nSVG_Main_W_PX / g_nSVG_Main_W_PT);
}

function funcGetSVGMain_PT(px)
{
	return px * (g_nSVG_Main_W_PT / g_nSVG_Main_W_PX);
}
