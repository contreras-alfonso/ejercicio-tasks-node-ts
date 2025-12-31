import bcrypt from "bcrypt";

const hash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const compare = async (
  password: string,
  passwordDb: string
): Promise<boolean> => {
  return await bcrypt.compare(password, passwordDb);
};

export { hash };
