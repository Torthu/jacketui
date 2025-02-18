import { Translate } from "../src";

// const translate = new Translate({
//   languages: {
//     no: { one: "en", two: "to", hello: "Hei ${person}" },
//     fr: { one: "un", two: "deux", hello: "Allô ${person}" },
//     en: { one: "one", two: "two", hello: (props) => `Hello ${props?.person}` },
//   },
//   currentLanguage: "no",
// });

// const t = translate.t;
// const translatedString = t("one"); // => 'en'
// console.log(translatedString);

// const norwegianHello = t("hello", { person: "Bob" }); // => Hei Bob
// console.log(norwegianHello);

// translate.setLanguage("fr");

// const frenchHello = t("hello", { person: "Bob" }); // => Allô Bob
// console.log(frenchHello);

// translate.setLanguage("en");

// const englishHello = t("hello", { person: "Bob" }); // => Hello Bob
// console.log(englishHello);

let translateInstance: Translate;
let t: Translate["t"];

describe.only("Translate", () => {
  beforeAll(() => {
    translateInstance = new Translate();
    t = translateInstance.t;
  });

  describe("register languages", () => {
    it("should be able to register first language", () => {
      translateInstance.registerLanguage("no", {
        one: "en",
        two: "to",
        hello: "Hei ${person}",
      });

      expect(translateInstance.getLanguage()).toBe("no");
    });

    it("should be able to register second language", () => {
      translateInstance.registerLanguage("fr", {
        one: "un",
        two: "deux",
        hello: "Allô ${person}",
      });

      expect(translateInstance.getAvailableLanguages()).toContain("fr");
    });

    it("should be able to register third language", () => {
      translateInstance.registerLanguage("en", {
        one: "one",
        two: "two",
        hello: (props) => `Hello ${props?.person}`,
      });

      expect(translateInstance.getAvailableLanguages()).toContain("fr");
    });
  });

  describe("t() no", () => {
    it("should be able to print a norwegian string", () => {
      const str = t("one");
      expect(str).toBe("en");
    });
    it("should print norwegian string with props", () => {
      const str = t("hello", { person: "Bob" });

      expect(str).toBe("Hei Bob");
    });

    it("should print english string if language code passed as third param", () => {
      const str = t("hello", { person: "Bob" }, "en");

      expect(str).toBe("Hello Bob");
    });
  });

  describe("t() fr", () => {
    it("should be able to set other language", () => {
      translateInstance.setLanguage("fr");

      expect(translateInstance.getLanguage()).toBe("fr");
    });

    it("should be able to print a french string", () => {
      const str = t("two");
      expect(str).toBe("deux");
    });
    it("should print french string with props", () => {
      const str = t("hello", { person: "Bob" });

      expect(str).toBe("Allô Bob");
    });
  });

  describe("t() en", () => {
    it("should be able to set other language", () => {
      translateInstance.setLanguage("en");

      expect(translateInstance.getLanguage()).toBe("en");
    });

    it("should be able to print an english string", () => {
      const str = t("two");
      expect(str).toBe("two");
    });
    it("should print english string with props", () => {
      const str = t("hello", { person: "Bob" });

      expect(str).toBe("Hello Bob");
    });
  });
});
