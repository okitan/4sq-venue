import fs from "fs";

export function guessTargetFromBranchName() {
  const branchName = fs.readFileSync(".git/HEAD").toString();
  const matched = branchName.match(/heads\/link-(.+)/);

  return matched ? matched[1] : undefined;
}
