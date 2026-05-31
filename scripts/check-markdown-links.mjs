#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const scriptPath = fileURLToPath(import.meta.url);

let failures = 0;

function main() {
  failures = 0;
  const documentFiles = findDocumentFiles(root)
    .filter(path => !path.includes("/node_modules/"))
    .filter(path => !path.includes("/.git/"));

  for (const file of documentFiles) {
    checkFile(file);
  }

  if (failures > 0) {
    console.error(`document links: failed (${failures} broken link${failures === 1 ? "" : "s"})`);
    process.exit(1);
  }

  console.log(`document links: ok (${documentFiles.length} files)`);
}

if (process.argv[1] === scriptPath) {
  main();
}

function checkFile(file) {
  const text = readFileSync(file, "utf8");
  const links = documentLinks(text);
  for (const link of links) {
    if (shouldSkip(link.target)) continue;
    const { targetPath, fragment } = splitTarget(link.target);
    if (!targetPath && !fragment) continue;

    const resolved = targetPath ? normalize(join(dirname(file), safeDecodeURIComponent(targetPath))) : file;
    if (!resolved.startsWith(root) || !existsSync(resolved)) {
      failures += 1;
      console.error(`[broken] ${relative(file)}:${link.line} -> ${link.target}`);
      continue;
    }

    if (fragment && !documentAnchors(readFileSync(resolved, "utf8")).has(safeDecodeURIComponent(fragment))) {
      failures += 1;
      console.error(`[broken-anchor] ${relative(file)}:${link.line} -> ${link.target}`);
    }
  }
}

function documentLinks(text) {
  return [...markdownLinks(text), ...markdownReferenceLinks(text), ...htmlAttributeLinks(text)];
}

function markdownLinks(text) {
  const links = [];
  const pattern = /!?\[[^\]\n]*\]\((?:<([^>\n]+)>|([^)\s\n]+))(?:\s+"[^"]*")?\)/g;
  for (const { line, number } of linkSourceLines(text)) {
    let match;
    while ((match = pattern.exec(line)) != null) {
      links.push({ target: match[1] ?? match[2], line: number });
    }
  }
  return links;
}

function htmlAttributeLinks(text) {
  const links = [];
  const pattern = /\b(?:href|src)=["']([^"']+)["']/gi;
  for (const { line, number } of linkSourceLines(text)) {
    let match;
    while ((match = pattern.exec(line)) != null) {
      links.push({ target: match[1], line: number });
    }
  }
  return links;
}

function markdownReferenceLinks(text) {
  const links = [];
  const pattern = /^[ \t]{0,3}\[[^\]\n]+\]:[ \t]*(?:<([^>\n]+)>|(\S+))/;
  for (const { line, number } of linkSourceLines(text)) {
    const match = pattern.exec(line);
    if (match) links.push({ target: match[1] ?? match[2], line: number });
  }
  return links;
}

function linkSourceLines(text) {
  const lines = [];
  let fenced = false;
  let htmlComment = false;
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (fenced) {
      if (/^[ \t]{0,3}(?:```|~~~)/.test(line)) fenced = false;
      continue;
    }
    const visibleLine = stripHtmlComments(line, { htmlComment });
    htmlComment = visibleLine.htmlComment;
    if (/^[ \t]{0,3}(?:```|~~~)/.test(visibleLine.line)) {
      fenced = true;
      continue;
    }
    if (visibleLine.line) lines.push({ line: visibleLine.line, number: index + 1 });
  }
  return lines;
}

function stripHtmlComments(line, state) {
  let rest = line;
  let visible = "";
  let htmlComment = state.htmlComment;
  while (rest.length > 0) {
    if (htmlComment) {
      const end = rest.indexOf("-->");
      if (end === -1) return { line: visible, htmlComment: true };
      rest = rest.slice(end + 3);
      htmlComment = false;
      continue;
    }

    const start = rest.indexOf("<!--");
    if (start === -1) {
      visible += rest;
      break;
    }
    visible += rest.slice(0, start);
    rest = rest.slice(start + 4);
    htmlComment = true;
  }
  return { line: visible, htmlComment };
}

function shouldSkip(target) {
  return /^(https?:|mailto:|\/)/i.test(target);
}

function splitTarget(target) {
  const withoutQuery = target.split("?")[0];
  const hashIndex = withoutQuery.indexOf("#");
  if (hashIndex === -1) return { targetPath: withoutQuery, fragment: "" };
  return {
    targetPath: withoutQuery.slice(0, hashIndex),
    fragment: withoutQuery.slice(hashIndex + 1),
  };
}

function documentAnchors(text) {
  const anchors = new Set();
  const lines = text.split(/\r?\n/);
  const headingCounts = new Map();
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) {
      const base = githubSlug(heading[2]);
      const count = headingCounts.get(base) ?? 0;
      headingCounts.set(base, count + 1);
      anchors.add(count === 0 ? base : `${base}-${count}`);
    }
    for (const match of line.matchAll(/\b(?:id|name)=["']([^"']+)["']/gi)) {
      anchors.add(match[1]);
    }
  }
  return anchors;
}

function githubSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~[\]()]/g, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function findDocumentFiles(dir) {
  const result = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      result.push(...findDocumentFiles(path));
    } else if (entry.endsWith(".md") || entry.endsWith(".html")) {
      result.push(path);
    }
  }
  return result;
}

function relative(path) {
  return path.slice(root.length + 1);
}

export { documentAnchors, documentLinks, htmlAttributeLinks, linkSourceLines, markdownLinks, markdownReferenceLinks, shouldSkip, splitTarget, stripHtmlComments, main };
