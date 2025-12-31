import jwt from "jsonwebtoken";

const generateJwt = (id: number, email: string) => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
};

export default generateJwt;
