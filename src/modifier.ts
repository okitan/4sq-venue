export function phoneExtractor(text: string): string | undefined {
  const matched = text.match(/(\d{2,4})-?(\d{2,4})-?(\d{3,4})/);

  return matched ? matched.slice(1, 4).join("") : undefined;
}

export function levelExtractor(text: string): number | undefined {
  return parseInt(text.replace("F", ""));
}
