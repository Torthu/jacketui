/**
 * Translate is a super simple translation class for Typescript/Javascript projects
 * Copyright (C) 2020 Torstein Thune
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// TODO: Make proper interfaces
interface TranslateConstructorProps {
  languages: Record<string, Language>;
  currentLanguage: string;
}

interface Language {
  [id: string]: string | ((props?: { [key: string]: unknown }) => string);
}

/**
 * Initialises Translate with default values
 * @example
 *  import Translate from '@torthu/Translate'
 *  const translate = new Translate({languages: {no: {one: 'en', two: 'to', hello: 'Hei ${person}'}, fr: {one: 'un', two: 'deux', hello: 'Allô ${world}'}}, currentLanguage: 'no'});
 * 	const t = translate.t;
 *  const translatedString = t('one'); // => 'en'
 *  const norwegianHello = t('hello', {person: "Bob"}); // => Hei Bob
 *  translate.setLanguage('fr');
 *  const frenchHello = t('hello', {person: "Bob"}); // => Allô Bob
 *
 * @param languages Object containing languages to register
 * @param currentLang Default current language
 * @returns {Function} The t (translate) function
 */
export class Translate {
  private i18nStrings: Record<string, Language>;
  private currentLanguage: string;

  constructor(
    { languages, currentLanguage }: TranslateConstructorProps = {
      languages: {},
      currentLanguage: "",
    }
  ) {
    this.i18nStrings = languages;
    this.currentLanguage = currentLanguage;

    this.t = this.t.bind(this);
    this.getLanguage = this.getLanguage.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
    this.getAvailableLanguages = this.getAvailableLanguages.bind(this);
    this.registerLanguage = this.registerLanguage.bind(this);
  }

  /**
   *
   * @param id Key to look up string
   * @param props Replacement values for string
   * @param language (default: currentLanguage) The language to look up for
   */
  t(
    id: string,
    props?: Record<string, string>,
    language: string = this.currentLanguage
  ): string {
    const str = this.findString(id, language);

    if (typeof str === "function") {
      return str(props);
    } else {
      return this.simpleStrReplace(str, props);
    }
  }

  getAvailableLanguages(): string[] {
    return Object.keys(this.i18nStrings);
  }

  /**
   * Get current language
   * @return {String}
   */
  getLanguage(): string {
    return this.currentLanguage;
  }

  /**
   *
   * @param lang Set current language
   */
  setLanguage(lang: string): void {
    this.currentLanguage = lang;
  }

  /**
   * Register string object for new language
   * @param langCode
   * @param lang
   */
  registerLanguage(langCode: string, lang: Language): void {
    this.i18nStrings[langCode] = lang;

    // Automatically set language to first registered language
    if (Object.keys(this.i18nStrings).length === 1) {
      this.setLanguage(langCode);
    }
  }

  private findString(id: string, lang: string) {
    return this.i18nStrings[lang][id] || `??[${id}][${lang}]??`;
  }

  // Replace ${var} with {var: 'This Value'}
  private simpleStrReplace(str: string, replace: Record<string, string> = {}) {
    return str.replace(/\$\{(.*?)\}/g, (match) => {
      match = match.substring(2, match.length - 1);
      return replace[match] || `??[${match}]??`;
    });
  }
}
