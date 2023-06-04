import { ExtractErrorCode } from "./ExtractErrorCode.js";

export interface ExtractError {
    code: ExtractErrorCode;
    message: string;
    level: number;
    key?: string;
    stack?: string;
}
