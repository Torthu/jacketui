import { Translate } from "../src";

const translate = new Translate({
  languages: {
    no: { one: "en", two: "to", hello: "Hei ${person}" },
    fr: { one: "un", two: "deux", hello: "Allô ${person}" },
    en: { one: "one", two: "two", hello: (props) => `Hello ${props?.person}` },
  },
  currentLanguage: "no",
});

const t = translate.t;
const translatedString = t("one"); // => 'en'
console.log(translatedString);

const norwegianHello = t("hello", { person: "Bob" }); // => Hei Bob
console.log(norwegianHello);

translate.setLanguage("fr");

const frenchHello = t("hello", { person: "Bob" }); // => Allô Bob
console.log(frenchHello);

translate.setLanguage("en");

const englishHello = t("hello", { person: "Bob" }); // => Hello Bob
console.log(englishHello);
