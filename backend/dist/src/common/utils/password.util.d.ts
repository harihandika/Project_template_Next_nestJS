export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(plain: string, hash: string): Promise<boolean>;
