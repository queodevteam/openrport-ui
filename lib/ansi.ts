const FG = ['#4b5563', '#f87171', '#4ade80', '#facc15', '#60a5fa', '#e879f9', '#22d3ee', '#e5e7eb'];
const FG_BRIGHT = ['#9ca3af', '#fca5a5', '#86efac', '#fde047', '#93c5fd', '#f0abfc', '#67e8f9', '#ffffff'];
const BG = ['#111827', '#7f1d1d', '#14532d', '#713f12', '#1e3a8a', '#701a75', '#164e63', '#d1d5db'];
const BG_BRIGHT = ['#374151', '#991b1b', '#166534', '#a16207', '#1d4ed8', '#a21caf', '#0e7490', '#f9fafb'];

function clampByte(value: number) {
	if (!Number.isFinite(value)) return 0;
	return Math.max(0, Math.min(255, value));
}

function cubeColor(n: number) {
	const index = clampByte(n);
	if (index < 8) return FG[index];
	if (index < 16) return FG_BRIGHT[index - 8];
	if (index >= 232) {
		const level = 8 + (index - 232) * 10;
		return `rgb(${level},${level},${level})`;
	}
	const color = index - 16;
	const r = Math.floor(color / 36);
	const g = Math.floor(color / 6) % 6;
	const b = color % 6;
	const step = (channel: number) => (channel === 0 ? 0 : 55 + channel * 40);
	return `rgb(${step(r)},${step(g)},${step(b)})`;
}

function escapeHtml(text: string) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function csiEnd(text: string, start: number) {
	for (let i = start; i < text.length; i += 1) {
		const code = text.charCodeAt(i);
		if (code >= 0x40 && code <= 0x7e) return i;
	}
	return -1;
}

type AnsiStyle = { bold: boolean; dim: boolean; underline: boolean; fg: string; bg: string };

function freshStyle(): AnsiStyle {
	return { bold: false, dim: false, underline: false, fg: '', bg: '' };
}

function applySgr(style: AnsiStyle, codes: number[]) {
	const list = codes.length ? codes : [0];
	for (let index = 0; index < list.length; index += 1) {
		const code = list[index];
		if (code === 0) {
			style.bold = false;
			style.dim = false;
			style.underline = false;
			style.fg = '';
			style.bg = '';
		}
		else if (code === 1) style.bold = true;
		else if (code === 2) style.dim = true;
		else if (code === 4) style.underline = true;
		else if (code === 22) {
			style.bold = false;
			style.dim = false;
		}
		else if (code === 24) style.underline = false;
		else if (code >= 30 && code <= 37) style.fg = FG[code - 30];
		else if (code >= 90 && code <= 97) style.fg = FG_BRIGHT[code - 90];
		else if (code === 39) style.fg = '';
		else if (code >= 40 && code <= 47) style.bg = BG[code - 40];
		else if (code >= 100 && code <= 107) style.bg = BG_BRIGHT[code - 100];
		else if (code === 49) style.bg = '';
		else if ((code === 38 || code === 48) && list[index + 1] === 5) {
			const color = cubeColor(list[index + 2] ?? 0);
			if (code === 38) style.fg = color;
			else style.bg = color;
			index += 2;
		}
		else if ((code === 38 || code === 48) && list[index + 1] === 2) {
			const color = `rgb(${clampByte(list[index + 2] ?? 0)},${clampByte(list[index + 3] ?? 0)},${clampByte(list[index + 4] ?? 0)})`;
			if (code === 38) style.fg = color;
			else style.bg = color;
			index += 4;
		}
	}
}

function styleAttribute(style: AnsiStyle) {
	const styles: string[] = [];
	if (style.bold) styles.push('font-weight:700');
	if (style.dim) styles.push('opacity:.72');
	if (style.underline) styles.push('text-decoration:underline');
	if (style.fg) styles.push(`color:${style.fg}`);
	if (style.bg) styles.push(`background-color:${style.bg}`);
	return styles.join(';');
}

export function createAnsiAppender(root: HTMLElement) {
	const style = freshStyle();
	const limit = 200_000;
	let span: HTMLSpanElement | null = null;
	let kept = 0;
	let marker: Text | null = null;

	const openSpan = () => {
		const attr = styleAttribute(style);
		if (!attr) {
			span = null;
			return;
		}
		span = document.createElement('span');
		span.setAttribute('style', attr);
		root.appendChild(span);
	};

	const dropNode = (node: ChildNode) => {
		const len = node.textContent?.length ?? 0;
		if (node === span) span = null;
		node.remove();
		kept -= len;
	};

	const ensureMarker = () => {
		if (marker?.isConnected) return;
		marker = document.createTextNode('[earlier output omitted]\n');
		root.insertBefore(marker, root.firstChild);
		kept += marker.length;
	};

	const trim = () => {
		if (kept <= limit) return;
		ensureMarker();
		while (kept > limit) {
			const node = marker?.nextSibling ?? null;
			if (!node) break;
			const len = node.textContent?.length ?? 0;
			const extra = kept - limit;
			if (len > extra && node.nodeType === Node.TEXT_NODE) {
				node.textContent = (node.textContent ?? '').slice(extra);
				kept -= extra;
				continue;
			}
			dropNode(node);
		}
	};

	const writePlain = (text: string) => {
		if (!text) return;
		const parent = span?.isConnected ? span : root;
		const last = parent.lastChild;
		if (last?.nodeType === Node.TEXT_NODE && last !== marker) last.textContent = `${last.textContent ?? ''}${text}`;
		else parent.appendChild(document.createTextNode(text));
		kept += text.length;
		trim();
	};

	const write = (input: string) => {
		const text = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
		let cursor = 0;
		while (cursor < text.length) {
			if (text[cursor] === '\u001b' && text[cursor + 1] === '[') {
				const end = csiEnd(text, cursor + 2);
				if (end === -1) break;
				const sequence = text.slice(cursor + 2, end);
				const command = text[end];
				cursor = end + 1;
				if (command === 'm') {
					const codes = sequence.split(';').filter(Boolean).map(part => Number(part));
					applySgr(style, codes.map(code => (Number.isFinite(code) ? code : 0)));
					openSpan();
				}
				continue;
			}
			if (text[cursor] === '\u001b' && text[cursor + 1] === ']') {
				const bel = text.indexOf('\u0007', cursor + 2);
				const st = text.indexOf('\u001b\\', cursor + 2);
				const end = bel === -1 ? st : st === -1 ? bel : Math.min(bel, st);
				cursor = end === -1 ? text.length : end + (text[end] === '\u0007' ? 1 : 2);
				continue;
			}
			let next = cursor;
			while (next < text.length && text[next] !== '\u001b') next += 1;
			writePlain(text.slice(cursor, next));
			cursor = next;
		}
	};

	const clear = () => {
		root.replaceChildren();
		span = null;
		marker = null;
		kept = 0;
		Object.assign(style, freshStyle());
	};

	return { write, clear };
}

export function ansiToHtml(input: string) {
	const text = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	let html = '';
	let open = false;
	const style = freshStyle();

	const close = () => {
		if (!open) return;
		html += '</span>';
		open = false;
	};

	const openSpan = () => {
		close();
		const attr = styleAttribute(style);
		if (!attr) return;
		html += `<span style="${attr}">`;
		open = true;
	};

	const apply = (codes: number[]) => {
		applySgr(style, codes);
		openSpan();
	};

	let cursor = 0;
	while (cursor < text.length) {
		if (text[cursor] === '\u001b' && text[cursor + 1] === '[') {
			const end = csiEnd(text, cursor + 2);
			if (end === -1) break;
			const sequence = text.slice(cursor + 2, end);
			const command = text[end];
			cursor = end + 1;
			if (command === 'm') {
				const codes = sequence.split(';').filter(Boolean).map(part => Number(part));
				apply(codes.map(code => (Number.isFinite(code) ? code : 0)));
			}
			continue;
		}
		if (text[cursor] === '\u001b' && text[cursor + 1] === ']') {
			const bel = text.indexOf('\u0007', cursor + 2);
			const st = text.indexOf('\u001b\\', cursor + 2);
			const end = bel === -1 ? st : st === -1 ? bel : Math.min(bel, st);
			cursor = end === -1 ? text.length : end + (text[end] === '\u0007' ? 1 : 2);
			continue;
		}
		let next = cursor;
		while (next < text.length && text[next] !== '\u001b') next += 1;
		html += escapeHtml(text.slice(cursor, next));
		cursor = next;
	}
	close();
	return html;
}
