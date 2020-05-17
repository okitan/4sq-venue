import { getSimilarity } from "../src/nameMatcher";

describe.each`
  description                        | a                 | b                 | score
  ${"4文字以下で全文マッチ"}         | ${"あいうえ"}     | ${"あいうえ"}     | ${1}
  ${"4文字以下で全文マッチしてない"} | ${"あいうえ"}     | ${"あいうお"}     | ${0}
  ${"片方が4文字以下"}               | ${"あいう"}       | ${"あいうえお"}   | ${1}
  ${"5文字以上で5文字以上マッチ"}    | ${"あいうえおか"} | ${"あいうえおき"} | ${5 / 6}
  ${"5文字以上で5文字未満マッチ"}    | ${"あいうえおか"} | ${"ほげあいうえ"} | ${0}
  ${"スペース混入"}                  | ${"あい うえ お"} | ${"あ いう えお"} | ${5 / 7}
`("getSimilarity", ({ description, a, b, score }) => {
  test(`with ${a} and ${b} (${description}) returns ${score}`, () => {
    expect(getSimilarity(a, b)).toBe(score);
  });
});
