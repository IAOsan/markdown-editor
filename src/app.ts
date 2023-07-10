import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { mangle } from 'marked-mangle';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { getClassName } from './utils';
import './styles.css';

// Set options
const options = {
	prefix: 'my-prefix-',
};
marked.use(mangle(), gfmHeadingId(options), {
	breaks: true,
	gfm: true,
});

const utilityBarBtnBaseClassname: string =
	'button button--toggle utility-bar__button';
const codeArea = <HTMLDivElement>document.getElementById('code-area')!;
const codeAreaControl = <HTMLTextAreaElement>(
	document.getElementById('code-area-control')!
);
const previewArea = <HTMLDivElement>document.getElementById('preview-area')!;
const splitScreenBtn = <HTMLButtonElement>(
	document.getElementById('split-screen')!
);
const previewScreenBtn = <HTMLButtonElement>(
	document.getElementById('view-full-preview')!
);
let splitScreenIsActive: boolean = true;
let previewScreenIsActive: boolean = false;
let timer: number | null = null;

function handleConvert(): void {
	const inputTextParsed = marked.parse(codeAreaControl.value);
	const cleanInputText = sanitizeHtml(inputTextParsed);
	previewArea.innerHTML = cleanInputText;
}

function handlePreviewAreaScroll(xCoord: number): void {
	previewArea.scrollTo({
		top: xCoord,
		behavior: 'smooth',
	});
}

function handleSplitScreen(): void {
	const scrollPercentage: number =
		Number(localStorage.getItem('scrollPosition')) || 0;

	if (window.innerWidth < 680) return;

	splitScreenIsActive = !splitScreenIsActive;

	if (splitScreenIsActive) {
		previewScreenIsActive = false;
		previewArea.removeAttribute('style');
		codeArea.removeAttribute('style');

		handlePreviewAreaScroll(
			Math.ceil(previewArea.scrollHeight * scrollPercentage)
		);
	} else {
		previewArea.style.display = 'none';
		codeArea.removeAttribute('style');
	}

	splitScreenBtn.className = getClassName(utilityBarBtnBaseClassname, {
		active: splitScreenIsActive,
	});
	previewScreenBtn.className = getClassName(utilityBarBtnBaseClassname, {
		active: previewScreenIsActive,
	});
}

function handlePreviewScreen(): void {
	const scrollPercentage: number =
		Number(localStorage.getItem('scrollPosition')) || 0;
	previewScreenIsActive = !previewScreenIsActive;

	if (previewScreenIsActive) {
		splitScreenIsActive = false;
		codeArea.style.display = 'none';
		previewArea.style.display = 'block';

		handlePreviewAreaScroll(
			Math.ceil(previewArea.scrollHeight * scrollPercentage)
		);
	} else {
		splitScreenIsActive = true;
		codeArea.removeAttribute('style');
		previewArea.removeAttribute('style');
	}

	previewScreenBtn.className = getClassName(utilityBarBtnBaseClassname, {
		active: previewScreenIsActive,
	});
	splitScreenBtn.className = getClassName(utilityBarBtnBaseClassname, {
		active: splitScreenIsActive,
	});
}

function handleScroll(): void {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}

	timer = window.setTimeout(() => {
		const scrollPercentage =
			codeAreaControl.scrollTop / codeAreaControl.scrollHeight;

		previewArea.scrollTo({
			top: Math.ceil(previewArea.scrollHeight * scrollPercentage),
			behavior: 'smooth',
		});

		localStorage.setItem('scrollPosition', scrollPercentage.toString());
	}, 200);
}

window.addEventListener('DOMContentLoaded', () => {
	const initialValue =
		'# Hello\n\nYou can start writing text in markdown format right here';
	codeAreaControl.value = initialValue;
	handleConvert();
});

codeArea.addEventListener('input', handleConvert);

splitScreenBtn.addEventListener('click', handleSplitScreen);

previewScreenBtn.addEventListener('click', handlePreviewScreen);

codeAreaControl.addEventListener('scroll', handleScroll);
