// helpers/excel.js

const XLSX 		= require("xlsx");

exports.toJSON = (path) => {
	const excel = XLSX.readFile(path);
	const sheetNames = excel.SheetNames; // regresa un array

	const json = {};
	sheetNames.forEach(function (value, index, sheetNames) {
		let sheetName = sheetNames[index];
		let data = XLSX.utils.sheet_to_json(excel.Sheets[sheetName]);
		this[sheetName] = [];
	    for (let i = 0; i < data.length; i++) {
			const row = data[i];
			this[sheetName].push({ ...row });
		}
	}, json);
		
	return json;
}