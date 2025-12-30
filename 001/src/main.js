import { SVG } from "@svgdotjs/svg.js";
import opentype from "opentype.js";
import camBamStickyUrl from "./fonts/cam-bam-stick-4.ttf";

const BOOKMARK = { w: 50, h: 200 }; // portrait
const MARGIN = 2;

const FONT_URL = camBamStickyUrl;

const BLACK = "#252525";
const PINK = "#FF00FF"; // Rose
const BLUE = "#00FFFF"; // Bleu
const YELLOW = "#FFFF00"; // Jaune
const GREEN = "#00FF00"; // Vert
const WHITE = "#f5f5f5";

const FONT_SIZE = 3;
const STROKE = 0.3175;

const CODE_TEXT = `opentype.load(FONT_URL, (err, font) => {
  if (err) return console.error(err);

  const draw = SVG()
    .addTo(\"#app\")
    .size(\\\`\\\${BOOKMARK.w}mm\\\`, \\\`\\\${BOOKMARK.h}mm\\\`)
    .viewbox(0, 0, BOOKMARK.w, BOOKMARK.h);

  const lines = CODE_TEXT.split(\"\\n\");

  const lineHeight =
    ((font.ascender - font.descender) / font.unitsPerEm) * FONT_SIZE * 1.25;

  let y = MARGIN + (font.ascender / font.unitsPerEm) * FONT_SIZE;

  const getColor = (word) => {
    if (
      [
        \"const\",
        \"let\",
        \"var\",
        \"import\",
        \"from\",
        \"return\",
        \"if\",
        \"else\",
        \"function\",
        \"=>\",
      ].includes(word)
    )
      return BLACK;
    if (word.startsWith('\\\"') || word.startsWith(\"'\") || word.startsWith(\"\\\`\"))
      return YELLOW;
    if (
      [
        \"SVG\",
        \"opentype\",
        \"console\",
        \"Math\",
        \"window\",
        \"document\",
        \"draw\",
        \"font\",
        \"path\",
        \"err\",
      ].includes(word) ||
      word.includes(\"(\")
    )
      return BLUE;
    if (
      [\"true\", \"false\", \"null\", \"undefined\"].includes(word) ||
      !isNaN(Number(word))
    )
      return GREEN;
    return PINK;
  };

  lines.forEach((line) => {
    let x = MARGIN;
    const words = line.split(/(\\s+|[(){},.;:\\\`'\"=])/g);

    words.forEach((word) => {
      if (!word) return;

      const color = getColor(word.trim());
      const path = font.getPath(word, x, y, FONT_SIZE);
      const d = path.toPathData(2);
      const width = font.getAdvanceWidth(word, FONT_SIZE);

      if (word.trim().length > 0) {
        draw.path(d).fill(\"none\").stroke({
          width: STROKE,
          linecap: \"round\",
          linejoin: \"round\",
          color: color,
        });
      }

      x += width;
    });

    y += lineHeight;
  });
});`;

opentype.load(FONT_URL, (err, font) => {
  if (err) return console.error(err);

  const draw = SVG()
    .addTo("#app")
    .size(`${BOOKMARK.w}mm`, `${BOOKMARK.h}mm`)
    .viewbox(0, 0, BOOKMARK.w, BOOKMARK.h);

  const lines = CODE_TEXT.split("\n");

  const lineHeight =
    ((font.ascender - font.descender) / font.unitsPerEm) * FONT_SIZE * 1.25;

  let y = MARGIN + (font.ascender / font.unitsPerEm) * FONT_SIZE;

  const getColor = (word) => {
    if (
      [
        "const",
        "let",
        "var",
        "import",
        "from",
        "return",
        "if",
        "else",
        "function",
        "=>",
      ].includes(word)
    )
      return BLACK;
    if (word.startsWith('"') || word.startsWith("'") || word.startsWith("`"))
      return YELLOW;
    if (
      [
        "SVG",
        "opentype",
        "console",
        "Math",
        "window",
        "document",
        "draw",
        "font",
        "path",
        "err",
      ].includes(word) ||
      word.includes("(")
    )
      return BLUE;
    if (
      ["true", "false", "null", "undefined"].includes(word) ||
      !isNaN(Number(word))
    )
      return GREEN;
    return PINK;
  };

  const pathsByColor = {
    [BLACK]: [],
    [PINK]: [],
    [BLUE]: [],
    [YELLOW]: [],
    [GREEN]: [],
  };

  lines.forEach((line) => {
    let x = MARGIN;
    const words = line.split(/(\s+|[(){},.;:`'"=])/g);

    words.forEach((word) => {
      if (!word) return;

      const color = getColor(word.trim());
      const path = font.getPath(word, x, y, FONT_SIZE);
      const d = path.toPathData(2);
      const width = font.getAdvanceWidth(word, FONT_SIZE);

      if (word.trim().length > 0) {
        pathsByColor[color].push(d);
      }

      x += width;
    });

    y += lineHeight;
  });

  Object.entries(pathsByColor).forEach(([color, paths]) => {
    if (paths.length > 0) {
      const group = draw.group();
      paths.forEach((d) => {
        group.path(d).fill("none").stroke({
          width: STROKE,
          linecap: "round",
          linejoin: "round",
          color: color,
        });
      });
    }
  });
});
