//function dateFormattedET(){
	const dateFormattedET = function(useFolkMonth){
		let timeNow = new Date();
		const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
		const folkMonthNamesET = ["näärikuu", "küünlakuu", "paastukuu", "jürikuu", "lehekuu", "jaanikuu", "heinakuu", "lõikuskuu", "mihklikuu", "viinakuu", "hingekuu", "jõulukuu"];
		//return dateNow + '.' + (monthNow + 1) + '.' + yearNow;
		if(useFolkMonth == 1){
		return timeNow.getDate() + '. ' + folkMonthNamesET[timeNow.getMonth()] + ' ' + timeNow.getFullYear();
	} else {
		return timeNow.getDate() + '. ' + monthNamesET[timeNow.getMonth()] + ' ' + timeNow.getFullYear();
	}
}

const weekdayET = function(){
	let weekDay = new Date().getDay();
	const weekdayNamesET = ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'];
	return weekdayNamesET[weekDay];
}

const addLeadZero = function(numValue){
	if(numValue < 10){
		//numValue = '0' + numValue
		numValue = String(numValue).padStart(2, '0');
	}
	return numValue
}

const timeFormattedET = function(){
		let timeNow = new Date();
		let hourNow = timeNow.getHours();
		let minuteNow = timeNow.getMinutes();
		let secondNow = timeNow.getSeconds();
		let timeFormattedET = hourNow + ":" + addLeadZero(minuteNow) + ":" + addLeadZero(secondNow);
		return timeFormattedET;
}

//ekspordin kõik vajaliku
module.exports = {fullDate: dateFormattedET, fullTime: timeFormattedET, weekDay: weekdayET}