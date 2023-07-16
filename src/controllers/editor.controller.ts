import { EditorModel } from '../models/editor.model';
import { EditorView } from '../views/editor.view';

export class EditorController {
	constructor(private model: EditorModel, private view: EditorView) {
		model.bindInputTextChange(this.onInputTextChange);
		view.setInitialInputText(model.initialInputText);
		view.bindLoad(this.handleInputTextChange);
		view.bindInputChange(this.handleInputTextChange);
		view.bindPreviewScreen(this.handlePreviewScreen);
		view.bindSplitScreen(this.handleSplitScreen);
	}

	public handleInputTextChange = (inputText: string): void => {
		this.model.updateInputText(inputText);
	};

	public handlePreviewScreen = (): void => {
		this.model.togglePreviewScreen();

		if (this.model.previewScreenIsActive) {
			this.model.disableSplitScreen();
			this.view.hideCodeArea();
			this.view.displayPreviewArea();
			this.view.previewAreaSyncScroll();
		} else {
			this.model.enableSplitScreen();
			this.view.displayCodeArea();
			this.view.displayPreviewArea();
		}

		this.view.updateUtilityBarButtonStyle(
			this.model.splitScreenIsActive,
			this.model.previewScreenIsActive
		);
	};

	public handleSplitScreen = (): void => {
		this.model.toggleSplitScreen();

		if (this.model.splitScreenIsActive) {
			this.model.disablePreviewScreen();
			this.view.displayPreviewArea();
			this.view.displayCodeArea();
			this.view.previewAreaSyncScroll();
		} else {
			this.view.hidePreviewArea();
			this.view.displayCodeArea();
		}

		this.view.updateUtilityBarButtonStyle(
			this.model.splitScreenIsActive,
			this.model.previewScreenIsActive
		);
	};

	public onInputTextChange = (parsedText: string): void => {
		this.view.displayPreviewCode(parsedText);
	};
}
