import { KiraErrorCode } from "../@Types/index";

export { KiraErrorCode };

export class KiraError extends Error {
  public readonly code: KiraErrorCode;

  constructor(message?: string, code: KiraErrorCode = KiraErrorCode.Validation) {
    super(message);
    this.name = "KiraError";
    this.code = code;
  }
}
