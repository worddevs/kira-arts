import { KiraError } from "../Utils/error.utils";
import { genCodeSnippetPng } from "../Utils/codeSnippetCard.output.utils";
import { type CodeSnippetOptions, type CodeSnippetLayout, KiraErrorCode } from "../@Types/index";

export async function codeSnippetImage(
  code: string,
  options: CodeSnippetOptions = {},
): Promise<Buffer> {
  if (!code || typeof code !== "string") {
    throw new KiraError("A valid code string is required", KiraErrorCode.Validation);
  }

  const layout: CodeSnippetLayout = {
    code,
    language: options.language ?? "javascript",
    fileName: options.fileName,
    windowTitle: options.windowTitle,
    theme: options.theme ?? "midnight",
    showLineNumbers: options.showLineNumbers ?? true,
    startLine: options.startLine ?? 1,
    highlightLines: options.highlightLines ?? [],
    accentColor: options.accentColor,
  };

  try {
    return await genCodeSnippetPng(layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
