import * as bcrypt from 'bcrypt';

export async function hashString(string: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(string, salt);
}

export async function compareHash(
  string: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(string, hash);
}
