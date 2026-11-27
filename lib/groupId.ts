export function groupLabel(id: string) {
	return id.replaceAll('-', ' ');
}

export function groupId(label: string) {
	return label.replaceAll(' ', '-');
}
