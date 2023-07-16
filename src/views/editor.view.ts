import { getClassName, throttle } from '../utils';

export class EditorView {
	private _codeArea: HTMLDivElement;
	private _previewArea: HTMLDivElement;
	private _textInput: HTMLTextAreaElement;
	private _splitScreenBtn: HTMLButtonElement;
	private _previewScreenBtn: HTMLButtonElement;
	private utilityBarBtnBaseClassname: string =
		'button button--toggle utility-bar__button';
	private THROTTLE_SCROLL_TIME: number = 100;
	private SCROLL_STORAGE_KEY: string = 'scrollPosition';

	constructor() {
		this._codeArea = <HTMLDivElement>this._getElement('#code-area');
		this._previewArea = <HTMLDivElement>this._getElement('#preview-area');
		this._textInput = <HTMLTextAreaElement>(
			this._getElement('#code-area-control')
		);
		this._splitScreenBtn = <HTMLButtonElement>(
			this._getElement('#split-screen')
		);
		this._previewScreenBtn = <HTMLButtonElement>(
			this._getElement('#view-full-preview')
		);
		this._initLocalListeners();
	}

	private _getElement(selector: string): HTMLElement | null {
		return document.querySelector(selector);
	}

	private get _inputText(): string {
		return this._textInput.value;
	}

	private _handleScroll() {
		const scrollPercentage =
			this._textInput.scrollTop / this._textInput.scrollHeight;

		this.previewAreaSyncScroll(scrollPercentage);

		localStorage.setItem(
			this.SCROLL_STORAGE_KEY,
			scrollPercentage.toString()
		);
	}

	private _initLocalListeners() {
		this._textInput.addEventListener(
			'scroll',
			throttle(this._handleScroll.bind(this), this.THROTTLE_SCROLL_TIME)
		);
	}

	private get _storedScrollPercentage(): number {
		return Number(localStorage.getItem(this.SCROLL_STORAGE_KEY)) || 0;
	}

	public bindPreviewScreen(handler: Function) {
		this._previewScreenBtn.addEventListener('click', () => {
			handler();
		});
	}

	public bindSplitScreen(handler: Function) {
		this._splitScreenBtn.addEventListener('click', () => {
			if (window.innerWidth < 680) return;
			handler();
		});
	}

	public bindInputChange(handler: (text: string) => void): void {
		this._textInput.addEventListener('input', () => {
			handler(this._inputText);
		});
	}

	public bindLoad(handler: (text: string) => void): void {
		window.addEventListener('load', () => {
			handler(this._inputText);
		});
	}

	public displayPreviewCode(htmlMarkup: string): void {
		this._previewArea.innerHTML = htmlMarkup;
	}

	public displayCodeArea(): void {
		this._codeArea.removeAttribute('style');
	}

	public displayPreviewArea(): void {
		this._previewArea.removeAttribute('style');
		// remove?
		this._previewArea.style.display = 'block';
	}

	public hideCodeArea(): void {
		this._codeArea.style.display = 'none';
	}

	public hidePreviewArea(): void {
		this._previewArea.style.display = 'none';
	}

	public setInitialInputText(initialText: string): void {
		this._textInput.value = initialText;
	}

	public previewAreaSyncScroll(scrollPercentage?: number | undefined): void {
		const percentage =
			scrollPercentage !== undefined
				? scrollPercentage
				: this._storedScrollPercentage;
		const fixedScrollValue: number =
			this._previewArea.scrollHeight * percentage;

		this._previewArea.scrollTo({
			top: fixedScrollValue,
			behavior: 'smooth',
		});
	}

	public updateUtilityBarButtonStyle(
		splitScreenIsActive: boolean,
		previewScreenIsActive: boolean
	) {
		this._splitScreenBtn.className = getClassName(
			this.utilityBarBtnBaseClassname,
			{
				active: splitScreenIsActive,
			}
		);
		this._previewScreenBtn.className = getClassName(
			this.utilityBarBtnBaseClassname,
			{
				active: previewScreenIsActive,
			}
		);
	}
}
