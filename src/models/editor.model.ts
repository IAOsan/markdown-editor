import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { mangle } from 'marked-mangle';
import { gfmHeadingId } from 'marked-gfm-heading-id';

interface State {
	inputText: string;
	initialInputText: string;
	splitScreenIsActive: boolean;
	previewScreenIsActive: boolean;
}

export class EditorModel {
	private _state: State = {
		inputText: '',
		initialInputText:
			'# Hello\n\nYou can start writing text in markdown format right here',
		splitScreenIsActive: true,
		previewScreenIsActive: false,
	};
	private _onInputTextChange: Function | undefined;

	constructor() {
		this._init();
	}

	private _init() {
		// Set options
		const options = {
			prefix: 'my-prefix-',
		};
		marked.use(mangle(), gfmHeadingId(options), {
			breaks: true,
			gfm: true,
		});
	}

	private get parsedInputText() {
		return sanitizeHtml(marked(this._state.inputText));
	}

	public bindInputTextChange(callback: (text: string) => void): void {
		this._onInputTextChange = callback;
	}

	public disablePreviewScreen(): void {
		this._state.previewScreenIsActive = false;
	}

	public disableSplitScreen(): void {
		this._state.splitScreenIsActive = false;
	}

	public enableSplitScreen(): void {
		this._state.splitScreenIsActive = true;
	}

	public get initialInputText(): string {
		return this._state.initialInputText;
	}

	public get previewScreenIsActive(): boolean {
		return this._state.previewScreenIsActive;
	}

	public get splitScreenIsActive(): boolean {
		return this._state.splitScreenIsActive;
	}

	public togglePreviewScreen(): void {
		this._state.previewScreenIsActive = !this._state.previewScreenIsActive;
	}

	public toggleSplitScreen(): void {
		this._state.splitScreenIsActive = !this._state.splitScreenIsActive;
	}

	public updateInputText(text: string): void {
		this._state.inputText = text;
		if (this._onInputTextChange) {
			this._onInputTextChange(this.parsedInputText);
		}
	}
}
