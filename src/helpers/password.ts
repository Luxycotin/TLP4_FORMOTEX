import bcrypt from "bcrypt";

const DEFAULT_SALT_ROUNDS = 10;

const getSaltRounds = (): number => {
  const envValue = process.env.BCRYPT_SALT_ROUNDS;

  if (!envValue) {
    return DEFAULT_SALT_ROUNDS;
  }

  const parsed = Number(envValue);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_SALT_ROUNDS;
};

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds = getSaltRounds();

  return bcrypt.hash(plainPassword, saltRounds);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => bcrypt.compare(plainPassword, hashedPassword);
