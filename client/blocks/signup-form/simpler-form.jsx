import { Button, Gridicon } from '@automattic/components';
import { localize } from 'i18n-calypso';
import { Component } from 'react';
import LoggedOutForm from 'calypso/components/logged-out-form';
import SocialSignupForm from './social';
import SocialSignupToS from './social-signup-tos';

import './simpler-form.scss';
class SimplerForm extends Component {
	state = {
		showEmailSignupForm: false,
	};

	showEmailSignupForm = () => this.setState( { showEmailSignupForm: true } );

	isEmailOnly() {
		return this.props.path.includes( '/email' );
	}

	getPath() {
		if ( this.isEmailOnly() ) {
			return this.props.path.replace( '/email', '' );
		}

		return this.props.path + '/email';
	}

	render() {
		const shouldShowEmailSignupForm =
			this.isEmailOnly() || this.props?.error?.error === 'password_invalid';

		return (
			<div className="simpler-form signup-form">
				{ shouldShowEmailSignupForm && (
					<LoggedOutForm onSubmit={ this.props.handleSubmit } noValidate={ true }>
						{ this.props.formFields }
						{ this.props.formFooter }
					</LoggedOutForm>
				) }

				{ ! shouldShowEmailSignupForm && this.props.isSocialSignupEnabled && (
					<SocialSignupForm
						handleResponse={ this.props.handleSocialResponse }
						socialService={ this.props.socialService }
						socialServiceResponse={ this.props.socialServiceResponse }
						isReskinned={ this.props.isReskinned }
						compact={ true }
						disableTosText={ true }
					/>
				) }

				{ ! shouldShowEmailSignupForm && (
					<div className="signup-form__p2-form-separator">{ this.props.translate( 'or' ) }</div>
				) }

				{ ! shouldShowEmailSignupForm && (
					<Button primary href={ this.getPath() }>
						<Gridicon icon="mail" size={ 48 } />
						<span>{ this.props.translate( 'Continue with email' ) }</span>
					</Button>
				) }

				{ ! shouldShowEmailSignupForm && <SocialSignupToS /> }

				{ this.props.footerLink }
			</div>
		);
	}
}

export default localize( SimplerForm );
