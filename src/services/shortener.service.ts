import ShortUniqueId from "short-unique-id";

const suid = new ShortUniqueId({ length: 11 });

function generateId(prefix = "www.us.com/"): string {
  return `${prefix}${suid.seq()}`;
}

export default generateId;
