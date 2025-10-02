import bcrypt from "bcrypt";
const DEFAULT_SALT_ROUNDS = 10;
const getSaltRounds = () => {
    const envValue = process.env.BCRYPT_SALT_ROUNDS;
    if (!envValue) {
        return DEFAULT_SALT_ROUNDS;
    }
    const parsed = Number(envValue);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_SALT_ROUNDS;
};
export const hashPassword = async (plainPassword) => {
    const saltRounds = getSaltRounds();
    return bcrypt.hash(plainPassword, saltRounds);
};
export const comparePassword = async (plainPassword, hashedPassword) => bcrypt.compare(plainPassword, hashedPassword);
//# sourceMappingURL=password.js.map