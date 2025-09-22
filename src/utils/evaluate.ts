export const evaluate = (
  string: string,
  {
    context,
  }: {
    context: Record<string, unknown>;
  },
) => {
  const sanitizedString = string.replace(/\n/g, "\\n");
  try {
    return new Function(
      "context",
      `
        const {${Object.keys(context).join(",")}} = context;
        return ${sanitizedString};
      `,
    )(context) as unknown;
  } catch (error) {
    console.log("Error", sanitizedString);
    throw error;
  }
};
