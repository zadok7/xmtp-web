// ENSStringHelpers.ts

/**
 * Checks if a given string is an ENS name by checking if it ends with `.eth` or `.cb.id`.
 * @param address The string to validate
 * @returns `true` if the string is an ENS name
 */
export const isEns = (address: string): boolean => {
    return address.endsWith('eth') || address.endsWith('.cb.id');
  };
  
  /**
   * Validates if a given string is an Ethereum address by checking if it starts with "0x" and has a length of 42 characters.
   * @param address The string to validate
   * @returns `true` if the string is a probable Ethereum address
   */
  export const is0xAddress = (address: string): boolean => {
    return address.startsWith('0x') && address.length === 42;
  };
  