function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (password.length < minLength) {
        return { valid: false, message: "Password must be at least 8 characters long." };
    }
    if (!hasUpperCase) {
        return { valid: false, message: "Password must contain at least one uppercase letter." };
    }
    if (!hasLowerCase) {
        return { valid: false, message: "Password must contain at least one lowercase letter." };
    }
    if (!hasNumber) {
        return { valid: false, message: "Password must contain at least one number." };
    }
    if (!hasSymbol) {
        return { valid: false, message: "Password must contain at least one special character." };
    }

    return { valid: true, message: "Password is valid." };
}
module.exports = validatePassword;
