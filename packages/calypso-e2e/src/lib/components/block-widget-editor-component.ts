import { Page } from 'playwright';

const selectors = {
	editor: '#widgets-editor',

	welcomeModalDismissButton: 'button[aria-label="Close dialogue"]',
	welcomeTourDismissButton: 'button[aria-label="Close Tour"]',

	addBlockButton: 'button[aria-label="Add block"]',
	blockSearch: 'input[placeholder="Search"]',
};

/**
 * Component for the block-based Widget editor in Appearance > Widgets.
 */
export class BlockWidgetEditorComponent {
	private page: Page;

	/**
	 * Constructs an instance of the component.
	 *
	 * @param {Page} page The underlying page.
	 */
	constructor( page: Page ) {
		this.page = page;
	}

	/**
	 * Dismiss the Welcome to Block Widgets modal.
	 *
	 * Note that this is not the same as the Welcome Tour, which is identical to the tour
	 * modal shown in the Gutenberg editor.
	 */
	async dismissModals(): Promise< void > {
		const welcomeButtonLocator = this.page.locator( selectors.welcomeModalDismissButton );
		// Only click if the locator resolves to an element.
		if ( ( await welcomeButtonLocator.count() ) > 0 ) {
			await welcomeButtonLocator.click();
		}

		const welcomeTourButtonLocator = this.page.locator( selectors.welcomeTourDismissButton );

		if ( ( await welcomeTourButtonLocator.count() ) > 0 ) {
			await welcomeTourButtonLocator.click();
		}
	}
}
