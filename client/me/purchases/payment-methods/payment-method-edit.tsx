import { Button } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { FunctionComponent, useState, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import {
	isPaymentAgreement,
	getPaymentMethodSummary,
	PaymentMethod,
} from 'calypso/lib/checkout/payment-methods';
import { errorNotice, successNotice } from 'calypso/state/notices/actions';
import { updateStoredCardTaxLocation } from 'calypso/state/stored-cards/actions';
import { isEditingStoredCard } from 'calypso/state/stored-cards/selectors';
import PaymentMethodEditDialog from './payment-method-edit-dialog';
import { TaxInfoContext } from './payment-method-tax-info-context';
import type { CalypsoDispatch } from 'calypso/state/types';

interface Props {
	card: PaymentMethod;
	tax_info_set: boolean;
}

const PaymentMethodEdit: FunctionComponent< Props > = ( { card } ) => {
	const translate = useTranslate();
	const isEditing = useSelector( ( state ) =>
		isEditingStoredCard( state, card.stored_details_id )
	);

	const reduxDispatch = useDispatch< CalypsoDispatch >();
	const [ isDialogVisible, setIsDialogVisible ] = useState( false );
	const closeDialog = useCallback( () => setIsDialogVisible( false ), [] );

	const { isTaxInfoSet, setTaxInfoSet } = useContext( TaxInfoContext );

	const setTaxInfo = (): boolean => {
		if ( card.tax_postal_code == null ) {
			return false;
		}
		return isTaxInfoSet;
	};

	setTaxInfoSet( setTaxInfo );

	const [ inputValues, setInputValues ] = useState( {
		tax_postal_code: '',
		tax_country_code: '',
	} );

	const handleEdit = useCallback( () => {
		closeDialog();

		reduxDispatch(
			updateStoredCardTaxLocation( card, inputValues.tax_postal_code, inputValues.tax_country_code )
		)
			.then( () => {
				if ( isPaymentAgreement( card ) ) {
					reduxDispatch( successNotice( translate( 'Payment method edited successfully' ) ) );
				} else {
					reduxDispatch( successNotice( translate( 'Card edited successfully!' ) ) );
				}
				recordTracksEvent( 'calypso_purchases_edit_tax_location' );
			} )
			.catch( ( error: Error ) => {
				reduxDispatch( errorNotice( error.message ) );
			} );
	}, [
		closeDialog,
		card,
		inputValues.tax_postal_code,
		inputValues.tax_country_code,
		translate,
		reduxDispatch,
	] );

	const handleSubmit = ( event: React.SyntheticEvent ) => {
		event.preventDefault();
		const { name, value } = event.target as HTMLInputElement;
		setInputValues( { ...inputValues, [ name ]: value } );
		handleEdit();
	};

	const renderEditForm = () => {
		return (
			<form onSubmit={ handleSubmit }>
				<input
					type="text"
					name="tax_postal_code"
					placeholder="Enter postal code"
					value={ inputValues.tax_postal_code }
					onChange={ ( e: React.ChangeEvent< HTMLInputElement > ): void =>
						setInputValues( {
							...inputValues,
							tax_postal_code: e.target.value,
						} )
					}
				/>
				<input
					type="text"
					name="tax_country_code"
					placeholder="Enter country code"
					value={ inputValues.tax_country_code }
					onChange={ ( e: React.ChangeEvent< HTMLInputElement > ): void =>
						setInputValues( {
							...inputValues,
							tax_country_code: e.target.value,
						} )
					}
				/>
			</form>
		);
	};

	const renderEditButton = () => {
		const text = isEditing ? translate( 'Editing' ) : translate( 'Add Payment Location Info' );
		if ( ! card.tax_postal_code || ! card.tax_country_code ) {
			return (
				<Button
					className="payment-method-edit__button"
					disabled={ isEditing }
					onClick={ () => setIsDialogVisible( true ) }
				>
					{ text }
				</Button>
			);
		}
	};

	return (
		<>
			<PaymentMethodEditDialog
				paymentMethodSummary={ getPaymentMethodSummary( {
					translate,
					type: card.card_type || card.payment_partner,
					digits: card.card,
					email: card.email,
				} ) }
				isVisible={ isDialogVisible }
				onClose={ closeDialog }
				onConfirm={ handleSubmit }
				card={ card }
				form={ renderEditForm() }
			/>
			{ renderEditButton() }
		</>
	);
};

export default PaymentMethodEdit;
