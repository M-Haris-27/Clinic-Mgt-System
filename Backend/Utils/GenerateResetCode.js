// Generate a 6-digit reset code
export const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
