export const blogArticleCreate = async ({ title, body }: { title: string; body: string }) => {
  // Mock action for demo purposes
  console.info("blogArticleCreate", { title, body });
  return {
    id: Math.random().toString(36).slice(2),
    status: "ok" as const,
    message: "Article created (mock)".trim(),
  };
};
