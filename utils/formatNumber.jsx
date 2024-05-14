import React from "react";

const FormatNumber = (num) => {
	if (!num && num !== 0) return "";
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default FormatNumber;
