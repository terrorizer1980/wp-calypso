import { SelectControl, TextControl } from '@wordpress/components';
import { useI18n } from '@wordpress/react-i18n';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { LoadingEllipsis } from 'calypso/components/loading-ellipsis';
import StepWrapper from 'calypso/signup/step-wrapper';
import { getCurrentUserCurrencyCode } from 'calypso/state/currency-code/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import SupportCard from '../components/support-card';
import { ActionSection, StyledNextButton } from '../confirm';
import {
	useSiteSettings,
	WOOCOMMERCE_DEFAULT_COUNTRY,
	WOOCOMMERCE_ONBOARDING_PROFILE,
} from '../hooks/use-site-settings';
import { getRevenueOptions } from './revenue-options';
import type { WooCommerceInstallProps } from '..';
import './style.scss';

export default function StepBusinessInfo( props: WooCommerceInstallProps ): ReactElement | null {
	const { goToStep, isReskinned } = props;
	const { __ } = useI18n();

	const siteId = useSelector( getSelectedSiteId ) as number;
	const currencyCode = useSelector( getCurrentUserCurrencyCode ) as string;

	const { get, save, update } = useSiteSettings( siteId );

	function updateProductTypes( type: string ) {
		updateOnboardingProfile( 'product_type', type );
	}

	function updateProductCount( count: string ) {
		updateOnboardingProfile( 'product_count', count );
	}

	function updateSellingVenues( venue: string ) {
		updateOnboardingProfile( 'selling_venues', venue );
	}

	function updateOtherPlatform( platform: string ) {
		updateOnboardingProfile( 'other_platform', platform );
	}

	function updateOtherPlatformName( name: string ) {
		updateOnboardingProfile( 'other_platform_name', name );
	}

	function updateOnboardingProfile( key: string, value: string | boolean ) {
		const profile_data = get( WOOCOMMERCE_ONBOARDING_PROFILE ) || {};

		profile_data[ key ] = value;

		update( WOOCOMMERCE_ONBOARDING_PROFILE, profile_data );
	}

	function getContent() {
		const profile_data = get( WOOCOMMERCE_ONBOARDING_PROFILE );

		return (
			<>
				<div className="step-business-info__info-section" />
				<div className="step-business-info__instructions-container">
					<SelectControl
						label={ __( 'What type of products will be listed?', 'woocommerce-admin' ) }
						value={ profile_data?.product_types?.shift() }
						options={ [
							{ value: '', label: '' },
							{ value: 'physical', label: __( 'Physical Products', 'woocommerce-admin' ) },
							{ value: 'downloads', label: __( 'Downloads', 'woocommerce-admin' ) },
							{ value: 'subscriptions', label: __( 'Subscriptions', 'woocommerce-admin' ) },
						] }
						onChange={ updateProductTypes }
					/>

					<SelectControl
						label={ __( 'How many products do you plan to display?', 'woocommerce-admin' ) }
						value={ '' }
						options={ [
							{ value: '', label: '' },
							{ value: '0', label: __( "I don't have any products yet.", 'woocommerce-admin' ) },
							{ value: '1-10', label: __( '1-10', 'woocommerce-admin' ) },
							{ value: '11-100', label: __( '11-101', 'woocommerce-admin' ) },
							{ value: '101-1000', label: __( '101-1000', 'woocommerce-admin' ) },
							{ value: '1000+', label: __( '1000+', 'woocommerce-admin' ) },
						] }
						onChange={ updateProductCount }
					/>

					<SelectControl
						label={ __( 'Currently selling elsewhere?', 'woocommerce-admin' ) }
						value={ '' }
						options={ [
							{ value: '', label: '' },
							{ value: 'no', label: __( 'No', 'woocommerce-admin' ) },
							{ value: 'other', label: __( 'Yes, on another platform', 'woocommerce-admin' ) },
							{
								value: 'other-woocommerce',
								label: __(
									'Yes, I own a different store powered by WooCommerce',
									'woocommerce-admin'
								),
							},
							{
								value: 'brick-mortar',
								label: __( 'Yes, in person at physical stores and/or events', 'woocommerce-admin' ),
							},
							{
								value: 'brick-mortar-other',
								label: __(
									'Yes, on another platform and in person at physical stores and/or events',
									'woocommerce-admin'
								),
							},
						] }
						onChange={ updateSellingVenues }
					/>

					{ [ 'other', 'brick-mortar', 'brick-mortar-other', 'other-woocommerce' ].includes(
						profile_data?.selling_venues
					) && (
						<SelectControl
							label={ __( "What's your current annual revenue?", 'woocommerce-admin' ) }
							value={ '' }
							options={ getRevenueOptions( currencyCode, get( WOOCOMMERCE_DEFAULT_COUNTRY ) ) }
							onChange={ updateSellingVenues }
						/>
					) }

					{ [ 'other', 'brick-mortar-other' ].includes( profile_data?.selling_venues ) && (
						<>
							<SelectControl
								label={ __( 'Which platform is the store using?', 'woocommerce-admin' ) }
								options={ [
									{
										value: 'shopify',
										label: __( 'Shopify', 'woocommerce-admin' ),
									},
									{
										value: 'bigcommerce',
										label: __( 'BigCommerce', 'woocommerce-admin' ),
									},
									{
										value: 'magento',
										label: __( 'Magento', 'woocommerce-admin' ),
									},
									{
										value: 'wix',
										label: __( 'Wix', 'woocommerce-admin' ),
									},
									{
										value: 'amazon',
										label: __( 'Amazon', 'woocommerce-admin' ),
									},
									{
										value: 'ebay',
										label: __( 'eBay', 'woocommerce-admin' ),
									},
									{
										value: 'etsy',
										label: __( 'Etsy', 'woocommerce-admin' ),
									},
									{
										value: 'squarespace',
										label: __( 'Squarespace', 'woocommerce-admin' ),
									},
									{
										value: 'other',
										label: __( 'Other', 'woocommerce-admin' ),
									},
								] }
								onChange={ updateOtherPlatform }
								required
							/>

							{ profile_data?.other_platform === 'other' && (
								<TextControl
									label={ __( 'What is the platform name?', 'woocommerce-admin' ) }
									onChange={ updateOtherPlatformName }
									value=""
								/>
							) }
						</>
					) }

					<ActionSection>
						<SupportCard />
						<StyledNextButton
							onClick={ () => {
								updateOnboardingProfile( 'completed', true );
								save();
								goToStep( 'store-address' );
							} }
							disabled={ ! profile_data }
						>
							{ __( 'Continue' ) }
						</StyledNextButton>
					</ActionSection>
				</div>
			</>
		);
	}

	if ( ! siteId ) {
		return (
			<div className="step-business-info__info-section">
				<LoadingEllipsis />
			</div>
		);
	}

	return (
		<StepWrapper
			flowName="woocommerce-install"
			hideSkip={ true }
			nextLabelText={ __( 'Continue' ) }
			allowBackFirstStep={ true }
			backUrl={ `/woocommerce-installation/${ wpcomDomain }` }
			headerText={ __( 'Tell us a bit about your business' ) }
			fallbackHeaderText={ __( 'Tell us a bit about your business' ) }
			subHeaderText={ __( 'We will guide to get started based on your responses.' ) }
			fallbackSubHeaderText={ __( 'We will guide to get started based on your responses.' ) }
			align={ isReskinned ? 'left' : 'center' }
			stepContent={ getContent() }
			isWideLayout={ isReskinned }
			{ ...props }
		/>
	);
}
