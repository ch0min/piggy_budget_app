import React from "react";

const FormatNumber = (num) => {
	const parsedNumber = parseFloat(num);

	if (!isNaN(parsedNumber)) {
		return parsedNumber.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	// if (!num && num !== 0) return "";
	// return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return "0";
};

export default FormatNumber;
