/**
 * @group calypso-pr
 */

import {
	DataHelper,
	SidebarComponent,
	PreviewComponent,
	ThemesPage,
	ThemesDetailPage,
	SiteSelectComponent,
	TestAccount,
} from '@automattic/calypso-e2e';

describe( DataHelper.createSuiteTitle( 'Theme: Preview and Activate' ), () => {
	const testAccount = new TestAccount( 'defaultUser' );
	const testAccountSiteDomain = testAccount.getSiteURL( { protocol: false } );
	let sidebarComponent;
	let themesPage;
	let themesDetailPage;
	let previewComponent;
	let popupTab;
	let page;
	// This test will use partial matching names to cycle between available themes.
	const themeName = 'Twenty Twen';

	beforeAll( async () => {
		page = await global.browser.newPage();
		await testAccount.authenticate( page );
	} );

	it( 'Navigate to Appearance > Themes', async function () {
		sidebarComponent = new SidebarComponent( page );
		await sidebarComponent.navigate( 'Appearance', 'Themes' );
	} );

	it( `Choose test site ${ testAccountSiteDomain } if Site Selector is shown`, async function () {
		const siteSelectComponent = new SiteSelectComponent( page );

		if ( await siteSelectComponent.isSiteSelectorVisible() ) {
			await siteSelectComponent.selectSite( testAccountSiteDomain );
		}
	} );

	it( `Search for free theme with keyword ${ themeName }`, async function () {
		themesPage = new ThemesPage( page );
		// 2021-11-29: Turn this on when premium themes are activated for everyone. -mreishus
		// await themesPage.filterThemes( 'Free' );
		await themesPage.search( themeName );
	} );

	it( `Select and view details of a theme starting with ${ themeName }`, async function () {
		const selectedTheme = await themesPage.select( themeName );
		await themesPage.hoverThenClick( selectedTheme );
	} );

	it( 'Preview theme', async function () {
		themesDetailPage = new ThemesDetailPage( page );
		await themesDetailPage.preview();
		previewComponent = new PreviewComponent( page );
		await previewComponent.previewReady();
	} );

	it( 'Close theme preview', async function () {
		await previewComponent.closePreview();
	} );

	it.skip( 'Activate theme', async function () {
		await themesDetailPage.activate();
	} );

	it.skip( 'Open theme customizer', async function () {
		popupTab = await themesDetailPage.customizeSite();
		await popupTab.waitForLoadState( 'load' );
	} );

	it.skip( 'Close theme customizer', async function () {
		await popupTab.close();
	} );
} );
