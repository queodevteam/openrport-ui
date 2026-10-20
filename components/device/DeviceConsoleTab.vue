<template>
	<div class="flex h-full min-h-0 flex-1 flex-col gap-3">
		<AppCard class="shrink-0">
			<div class="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
				<div class="flex min-w-0 items-center gap-2.5">
					<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
							<path fill="currentColor" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2m1 3.2 2.8 2.3L5 13v1.6l4.2-3.5L5 7.6zm6 6.3h6V16h-6z" />
						</svg>
					</span>
					<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
						Command
					</h3>
				</div>
				<span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Ctrl+Enter</span>
			</div>
			<div class="p-3">
				<textarea
					v-model="draft"
					rows="4"
					class="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 font-mono text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
					placeholder="hostname&#10;or a script, one line per command"
					:disabled="running"
					@keydown="onKeydown"
				/>
			</div>
			<div class="flex items-center justify-end gap-3 border-t border-gray-100 px-3 py-2">
				<button
					v-if="running"
					type="button"
					class="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-700 hover:bg-red-100"
					@click="stop"
				>
					Stop
				</button>
				<button
					v-else
					type="button"
					class="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-primary-800 px-4 text-sm font-medium text-white disabled:opacity-40"
					:disabled="!draft.trim()"
					@click="submit"
				>
					Run
				</button>
			</div>
		</AppCard>
		<div class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700">
			<div class="flex items-center gap-2.5 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
				<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
						<path fill="currentColor" d="M4 6h16v2H4zm0 4h10v2H4zm0 4h16v2H4zm0 4h7v2H4z" />
					</svg>
				</span>
				<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
					Output
				</h3>
			</div>
			<div
				ref="logEl"
				class="min-h-0 flex-1 overflow-y-auto bg-gray-950 p-3"
			>
				<p
					v-if="!hasOutput"
					class="font-mono text-xs leading-5 text-gray-500"
				>
					Output appears here.
				</p>
				<pre
					ref="preEl"
					class="whitespace-pre-wrap break-all font-mono text-xs leading-5 text-gray-100"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useDeviceConsole } from '~/composables/useDeviceConsole';
import { createAnsiAppender } from '~/lib/ansi';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
});

const draft = ref('');
const logEl = ref<HTMLElement | null>(null);
const preEl = ref<HTMLElement | null>(null);
const hasOutput = ref(false);
const { running, bindOutput, run, stop } = useDeviceConsole();

const submit = () => {
	const text = draft.value;
	if (!text.trim() || running.value) return;
	run(props.id, text);
};

const onKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		submit();
	}
};

onMounted(() => {
	if (!preEl.value) return;
	const writer = createAnsiAppender(preEl.value);
	const maxLines = 1_000;
	const maxLineChars = 2_000;
	const lines: string[] = [];
	let partial = '';
	let omitted = false;
	let paintTimer = 0;

	const pushLine = (line: string) => {
		if (line.length <= maxLineChars) {
			lines.push(line);
			return;
		}
		for (let index = 0; index < line.length; index += maxLineChars) {
			lines.push(line.slice(index, index + maxLineChars));
		}
	};

	const paint = () => {
		paintTimer = 0;
		writer.clear();
		if (!lines.length && !partial) {
			hasOutput.value = false;
			return;
		}
		hasOutput.value = true;
		if (omitted) writer.write('[earlier output omitted]\n');
		if (lines.length) writer.write(`${lines.join('\n')}\n`);
		if (partial) writer.write(partial);
		const box = logEl.value;
		if (box) box.scrollTop = box.scrollHeight;
	};

	const schedulePaint = () => {
		if (paintTimer) return;
		paintTimer = window.setTimeout(paint, 200);
	};

	bindOutput((text, reset) => {
		if (reset) {
			lines.length = 0;
			partial = '';
			omitted = false;
			if (paintTimer) window.clearTimeout(paintTimer);
			paintTimer = 0;
			writer.clear();
			hasOutput.value = false;
		}
		if (!text) return;
		const parts = `${partial}${text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')}`.split('\n');
		partial = parts.pop() ?? '';
		for (const line of parts) pushLine(line);
		while (partial.length > maxLineChars) {
			pushLine(partial.slice(0, maxLineChars));
			partial = partial.slice(maxLineChars);
		}
		if (lines.length > maxLines) {
			lines.splice(0, lines.length - maxLines);
			omitted = true;
		}
		schedulePaint();
	});
});

watch(() => props.active, (active) => {
	if (!active) stop();
});

onBeforeUnmount(() => {
	stop();
});
</script>
