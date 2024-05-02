export const isValidEmail = (email) => {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email.toLowerCase());
};

export const isPasswordStrongEnough = (password) => {
	return password.length >= 6;
};
