import { EditorController } from './controllers/editor.controller';
import { EditorModel } from './models/editor.model';
import { EditorView } from './views/editor.view';
import './styles.css';

function init() {
	new EditorController(new EditorModel(), new EditorView());
}

window.addEventListener('DOMContentLoaded', init);
