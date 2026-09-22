import type { CodeSnippetLanguage, Token, LanguageConfig } from "../../@Types/index";

const JS_KEYWORDS = [
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "class",
  "import",
  "export",
  "default",
  "from",
  "as",
  "extends",
  "new",
  "typeof",
  "instanceof",
  "async",
  "await",
  "try",
  "catch",
  "finally",
  "throw",
  "switch",
  "case",
  "break",
  "continue",
  "this",
  "super",
  "null",
  "undefined",
  "true",
  "false",
  "void",
  "interface",
  "type",
  "enum",
  "implements",
  "public",
  "private",
  "protected",
  "readonly",
  "static",
  "in",
  "of",
  "yield",
  "delete",
];

const PYTHON_KEYWORDS = [
  "def",
  "return",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "class",
  "import",
  "from",
  "as",
  "try",
  "except",
  "finally",
  "raise",
  "break",
  "continue",
  "pass",
  "lambda",
  "with",
  "yield",
  "None",
  "True",
  "False",
  "and",
  "or",
  "not",
  "in",
  "is",
  "global",
  "nonlocal",
  "async",
  "await",
  "self",
];

const JAVA_CSHARP_KEYWORDS = [
  "public",
  "private",
  "protected",
  "static",
  "final",
  "void",
  "class",
  "interface",
  "extends",
  "implements",
  "new",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "throws",
  "import",
  "package",
  "using",
  "namespace",
  "this",
  "super",
  "null",
  "true",
  "false",
  "int",
  "string",
  "String",
  "bool",
  "boolean",
  "double",
  "float",
  "long",
  "var",
  "async",
  "await",
  "readonly",
  "const",
];

const BASH_KEYWORDS = [
  "if",
  "then",
  "else",
  "elif",
  "fi",
  "for",
  "do",
  "done",
  "while",
  "case",
  "esac",
  "function",
  "return",
  "exit",
  "export",
  "local",
  "echo",
  "in",
];

const LANGUAGE_CONFIG: Record<CodeSnippetLanguage, LanguageConfig> = {
  javascript: { lineComment: "//", keywords: new Set(JS_KEYWORDS) },
  typescript: { lineComment: "//", keywords: new Set(JS_KEYWORDS) },
  java: { lineComment: "//", keywords: new Set(JAVA_CSHARP_KEYWORDS) },
  csharp: { lineComment: "//", keywords: new Set(JAVA_CSHARP_KEYWORDS) },
  python: { lineComment: "#", keywords: new Set(PYTHON_KEYWORDS) },
  bash: { lineComment: "#", keywords: new Set(BASH_KEYWORDS) },
  json: { keywords: new Set(["true", "false", "null"]) },
  plaintext: { keywords: new Set() },
};

const TOKEN_PATTERN =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|(\s+)|([^\sA-Za-z0-9_$]+)/g;

export function tokenizeLine(line: string, language: CodeSnippetLanguage): Token[] {
  const config = LANGUAGE_CONFIG[language] ?? LANGUAGE_CONFIG.plaintext;
  const tokens: Token[] = [];

  if (config.lineComment) {
    const commentIndex = findCommentIndex(line, config.lineComment);
    if (commentIndex >= 0) {
      tokens.push(...tokenizeSegment(line.slice(0, commentIndex), config));
      tokens.push({ text: line.slice(commentIndex), type: "comment" });
      return tokens;
    }
  }

  return tokenizeSegment(line, config);
}

function findCommentIndex(line: string, marker: string): number {
  let inString: string | null = null;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inString) {
      if (char === "\\") {
        i++;
      } else if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = char;
      continue;
    }

    if (line.startsWith(marker, i)) return i;
  }

  return -1;
}

function tokenizeSegment(segment: string, config: LanguageConfig): Token[] {
  const tokens: Token[] = [];
  TOKEN_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = TOKEN_PATTERN.exec(segment)) !== null) {
    const [full, stringToken, numberToken, identifierToken, whitespaceToken] = match;

    if (stringToken) {
      tokens.push({ text: stringToken, type: "string" });
    } else if (numberToken) {
      tokens.push({ text: numberToken, type: "number" });
    } else if (identifierToken) {
      if (config.keywords.has(identifierToken)) {
        tokens.push({ text: identifierToken, type: "keyword" });
      } else if (segment[TOKEN_PATTERN.lastIndex] === "(") {
        tokens.push({ text: identifierToken, type: "function" });
      } else {
        tokens.push({ text: identifierToken, type: "plain" });
      }
    } else if (whitespaceToken) {
      tokens.push({ text: whitespaceToken, type: "plain" });
    } else {
      tokens.push({ text: full, type: "punctuation" });
    }
  }

  return tokens;
}
