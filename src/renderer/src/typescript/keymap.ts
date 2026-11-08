type HotkeyEvent = (event: KeyboardEvent | WheelEvent) => void;

export type Hotkey = {
	key: string;
	handler: HotkeyEvent;
	preventDefault?: boolean;
	stopPropagation?: boolean;
	enabled?: boolean;
	allowInInput?: boolean;
};

export class Keymap {
	private hotkeys = new Map<string, Hotkey>();
	private enabled = true;
	private target: Window | HTMLElement;

	constructor(target: Window | HTMLElement = window) {
		this.target = target;

		this.target.addEventListener('keydown', this.onKeyDown);
		this.target.addEventListener('wheel', this.onWheel, {
			passive: false
		});
	}

	private normalize(key: string): string {
		const aliases: Record<string, string> = {
			cmd: 'meta',
			command: 'meta',
			control: 'ctrl',
			option: 'alt',
			esc: 'escape',
			'-': 'minus',
			scroll_up: 'scroll_top',
			mod: /Mac|iPhone|iPad/i.test(navigator.userAgent) ? 'meta' : 'ctrl'
		};

		return key
			.toLowerCase()
			.replace(/\+\+/g, '+plus')
			.split('+')
			.map((k) => {
				const part = k.trim();
				return aliases[part] ?? part;
			})
			.sort()
			.join('+');
	}

	private getModifiers(event: KeyboardEvent | WheelEvent): string[] {
		const keys: string[] = [];

		if (event.ctrlKey) keys.push('ctrl');
		if (event.shiftKey) keys.push('shift');
		if (event.altKey) keys.push('alt');
		if (event.metaKey) keys.push('meta');

		return keys;
	}

	private getEventKey(event: KeyboardEvent): string {
		const keys = this.getModifiers(event);
		let key = event.key.toLowerCase();

		if (['control', 'shift', 'alt', 'meta'].includes(key)) {
			return this.normalize(keys.join('+'));
		}

		if (key === '+') key = 'plus';
		if (key === '-') key = 'minus';
		if (key === ' ') key = 'space';

		keys.push(key);

		return this.normalize(keys.join('+'));
	}

	private getWheelKey(event: WheelEvent): string {
		const keys = this.getModifiers(event);

		if (event.deltaY > 0) {
			keys.push('scroll_down');
		} else {
			keys.push('scroll_top');
		}

		return this.normalize(keys.join('+'));
	}

	private execute(hotkey: Hotkey | undefined, event: KeyboardEvent | WheelEvent): void {
		if (!hotkey || hotkey.enabled === false) return;

		const target = event.target;

		const isInput =
			target instanceof Element &&
			(target.matches('input, textarea, select') ||
				target.closest('[contenteditable="true"], [contenteditable=""]') !== null);

		if (isInput && !hotkey.allowInInput) return;

		if (hotkey.preventDefault !== false && event.cancelable) {
			event.preventDefault();
		}

		if (hotkey.stopPropagation) {
			event.stopPropagation();
		}

		hotkey.handler(event);
	}

	private onKeyDown = (event: KeyboardEvent): void => {
		if (!this.enabled || event.repeat) return;

		const key = this.getEventKey(event);
		let hotkey = this.hotkeys.get(key);

		// '+' often requires Shift on physical keyboards.
		// Allow CTRL++ to match CTRL+SHIFT+PLUS.
		if (!hotkey && event.key === '+' && event.shiftKey) {
			const fallback = key
				.split('+')
				.filter((k) => k !== 'shift')
				.join('+');

			hotkey = this.hotkeys.get(fallback);
		}

		this.execute(hotkey, event);
	};

	private onWheel = (event: WheelEvent): void => {
		if (!this.enabled || event.deltaY === 0) return;

		const key = this.getWheelKey(event);
		const hotkey = this.hotkeys.get(key);

		this.execute(hotkey, event);
	};

	register(hotkey: Hotkey): () => void {
		const key = this.normalize(hotkey.key);
		this.hotkeys.set(key, hotkey);

		return () => {
			if (this.hotkeys.get(key) === hotkey) {
				this.hotkeys.delete(key);
			}
		};
	}

	registerAll(hotkeys: Hotkey[]): () => void {
		const cleanups = hotkeys.map((h) => this.register(h));
		return () => cleanups.forEach((cleanup) => cleanup());
	}

	unregister(key: string): void {
		this.hotkeys.delete(this.normalize(key));
	}

	enable(): void {
		this.enabled = true;
	}

	disable(): void {
		this.enabled = false;
	}

	clear(): void {
		this.hotkeys.clear();
	}

	destroy(): void {
		this.target.removeEventListener('keydown', this.onKeyDown);
		this.target.removeEventListener('wheel', this.onWheel);
		this.clear();
	}
}
