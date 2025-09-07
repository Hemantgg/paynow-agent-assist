export const redactCustomerId = (id?: string) => (id ? id.replace(/.(?=.{2})/g, '*') : undefined);
