/*
 * The MIT License (MIT)
 * Copyright (c) 2010-2020 Robert Kieffer and other contributors
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * Imported from uuidjs: https://github.com/uuidjs
 */

/* tslint:disable */

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex: any[] = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function bytesToUuid(buf: any, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (
    byteToHex[buf[offset + 0]] +
    byteToHex[buf[offset + 1]] +
    byteToHex[buf[offset + 2]] +
    byteToHex[buf[offset + 3]] +
    "-" +
    byteToHex[buf[offset + 4]] +
    byteToHex[buf[offset + 5]] +
    "-" +
    byteToHex[buf[offset + 6]] +
    byteToHex[buf[offset + 7]] +
    "-" +
    byteToHex[buf[offset + 8]] +
    byteToHex[buf[offset + 9]] +
    "-" +
    byteToHex[buf[offset + 10]] +
    byteToHex[buf[offset + 11]] +
    byteToHex[buf[offset + 12]] +
    byteToHex[buf[offset + 13]] +
    byteToHex[buf[offset + 14]] +
    byteToHex[buf[offset + 15]]
  ).toLowerCase();
}

export default bytesToUuid;
