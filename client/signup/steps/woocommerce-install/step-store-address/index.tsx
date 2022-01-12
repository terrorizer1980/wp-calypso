import styled from '@emotion/styled';
import { TextControl, ComboboxControl } from '@wordpress/components';
import { useI18n } from '@wordpress/react-i18n';
import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingEllipsis } from 'calypso/components/loading-ellipsis';
import StepWrapper from 'calypso/signup/step-wrapper';
import { fetchWooCommerceCountries } from 'calypso/state/countries/actions';
import getCountries from 'calypso/state/selectors/get-countries';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import SupportCard from '../components/support-card';
import { ActionSection, StyledNextButton } from '../confirm';
import {
	useSiteSettings,
	WOOCOMMERCE_STORE_ADDRESS_1,
	WOOCOMMERCE_STORE_ADDRESS_2,
	WOOCOMMERCE_STORE_CITY,
	WOOCOMMERCE_DEFAULT_COUNTRY,
	WOOCOMMERCE_STORE_POSTCODE,
} from '../hooks/use-site-settings';
import useWooCommerceOnPlansEligibility from '../hooks/use-woop-handling';
import type { WooCommerceInstallProps } from '..';
import './style.scss';

const CityZipRow = styled.div`
	display: -ms-grid;
	display: grid;
	width: 100%;
	-ms-grid-columns: 48% 4% 48%;
	grid-template-columns: 48% 48%;
	grid-column-gap: 4%;
	justify-items: stretch;
`;

export default function StepStoreAddress( props: WooCommerceInstallProps ): ReactElement | null {
	const { goToStep, isReskinned, headerTitle, headerDescription } = props;
	const { __ } = useI18n();
	const dispatch = useDispatch();

	useEffect( () => {
		dispatch( fetchWooCommerceCountries() );
	}, [ dispatch ] );
	const siteId = useSelector( getSelectedSiteId ) as number;

	const countriesList = useSelector( ( state ) => getCountries( state, 'woocommerce' ) ) || [];
	const countriesAsOptions = Object.entries( countriesList ).map( ( [ key, value ] ) => {
		return { value: key, label: value };
	} );

	const { get, save, update } = useSiteSettings( siteId );

	const { wpcomDomain } = useWooCommerceOnPlansEligibility( siteId );
	const handleCountryChange = ( value: string | null ) => {
		update( WOOCOMMERCE_DEFAULT_COUNTRY, value || '' );
	};

	function getContent() {
		return (
			<>
				<div className="step-store-address__info-section" />
				<div className="step-store-address__instructions-container">
					<form
						onSubmit={ () => {
							save();
							goToStep( 'confirm' );
						} }
					>
						<TextControl
							label={ __( 'Address line 1' ) }
							value={ get( WOOCOMMERCE_STORE_ADDRESS_1 ) }
							onChange={ ( value ) => update( WOOCOMMERCE_STORE_ADDRESS_1, value ) }
							required={ true }
						/>

						<TextControl
							label={ __( 'Address line 2' ) }
							value={ get( WOOCOMMERCE_STORE_ADDRESS_2 ) }
							onChange={ ( value ) => update( WOOCOMMERCE_STORE_ADDRESS_2, value ) }
						/>

						<ComboboxControl
							label={ __( 'Country / Region' ) }
							value={ get( WOOCOMMERCE_DEFAULT_COUNTRY ) }
							onChange={ handleCountryChange }
							options={ countriesAsOptions }
							required={ true }
						/>

						<CityZipRow>
							<TextControl
								label={ __( 'City' ) }
								value={ get( WOOCOMMERCE_STORE_CITY ) }
								onChange={ ( value ) => update( WOOCOMMERCE_STORE_CITY, value ) }
								required={ true }
							/>

							<TextControl
								label={ __( 'Postcode' ) }
								value={ get( WOOCOMMERCE_STORE_POSTCODE ) }
								onChange={ ( value ) => update( WOOCOMMERCE_STORE_POSTCODE, value ) }
								required={ true }
							/>
						</CityZipRow>

						<ActionSection>
							<SupportCard />
							<StyledNextButton type="submit">{ __( 'Continue' ) }</StyledNextButton>
						</ActionSection>
					</form>
				</div>
			</>
		);
	}

	if ( ! siteId ) {
		return (
			<div className="step-store-address__info-section">
				<LoadingEllipsis />
			</div>
		);
	}

	return (
		<StepWrapper
			flowName="woocommerce-install"
			hideSkip={ true }
			nextLabelText={ __( 'Confirm' ) }
			allowBackFirstStep={ true }
			backUrl={ `/woocommerce-installation/${ wpcomDomain }` }
			headerText={ headerTitle }
			fallbackHeaderText={ headerTitle }
			subHeaderText={ headerDescription }
			fallbackSubHeaderText={ headerDescription }
			align={ isReskinned ? 'left' : 'center' }
			stepContent={ getContent() }
			isWideLayout={ isReskinned }
			{ ...props }
		/>
	);
}
