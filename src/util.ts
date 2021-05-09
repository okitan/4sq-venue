import fs from "fs";

export function guessTargetFromBranchName(): string | undefined {
  const branchName = fs.readFileSync(".git/HEAD").toString();
  const matched = branchName.match(/heads\/(?:scrape|link)-(.+)/);

  return matched ? matched[1] : undefined;
}
