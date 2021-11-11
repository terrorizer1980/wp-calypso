/**
 * @group calypso-pr
 */

import {
	DataHelper,
	LoginPage,
	SidebarComponent,
	SupportComponent,
	setupHooks,
} from '@automattic/calypso-e2e';
import { Page } from 'playwright';

describe( DataHelper.createSuiteTitle( 'Support: Popover' ), function () {
	let page: Page;

	setupHooks( ( args: { page: Page } ) => {
		page = args.page;
	} );

	describe.each( [
		{ siteType: 'Simple', user: 'defaultUser' },
		{ siteType: 'Atomic', user: 'eCommerceUser' },
	] )( 'Search and view a support article ($siteType)', function ( { user } ) {
		let supportComponent: SupportComponent;
		let supportArticlePage: Page;

		it( 'Log in', async function () {
			const loginPage = new LoginPage( page );
			await loginPage.login( { account: user } );
		} );

		it( 'Navigate to Tools > Marketing', async function () {
			const sidebarComponent = new SidebarComponent( page );
			await sidebarComponent.navigate( 'Tools', 'Marketing' );
		} );

		it( 'Open support popover', async function () {
			supportComponent = new SupportComponent( page );
			await supportComponent.openPopover();
		} );

		it( 'Displays default entries', async function () {
			await supportComponent.defaultStateShown();
		} );

		it( 'Enter search keyword', async function () {
			const keyword = 'theme';
			await supportComponent.search( keyword );
		} );

		it( 'Search results are shown', async function () {
			const results = await supportComponent.getResults( 'article' );
			expect( results.length ).toBeGreaterThan( 0 );
		} );

		it( 'Click and visit first support article', async function () {
			await supportComponent.clickResult( 'article', 1 );
			await supportComponent.clickReadMore();
			// Obtain handle to the popup page.
			supportArticlePage = await supportComponent.visitArticle();
		} );

		it( 'Close article page and preview', async function () {
			await supportArticlePage.close();
			await supportComponent.closeArticle();
		} );
	} );
} );