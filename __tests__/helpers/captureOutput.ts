function format(args: unknown[]): string {
  return args
    .map((arg) =>
      typeof arg === "string"
        ? arg
        : arg instanceof Error
          ? arg.message
          : JSON.stringify(arg),
    )
    .join(" ");
}

export async function captureOutput(
  fn: () => Promise<void> | void,
): Promise<string> {
  const originalLog = console.log;
  const originalError = console.error;
  let output = "";
  console.log = (...args: unknown[]) => {
    output += format(args) + "\n";
  };
  console.error = (...args: unknown[]) => {
    output += format(args) + "\n";
  };
  try {
    await fn();
    return output;
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}
