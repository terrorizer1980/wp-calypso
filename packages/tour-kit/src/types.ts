import React from 'react';
import type { Modifier } from 'react-popper';

export interface Step {
	referenceElements?: {
		desktop?: string;
		mobile?: string;
	};
	meta: {
		[ key: string ]: unknown;
		// | React.FunctionComponent< Record< string, unknown > >
		// | HTMLElement
		// | string
		// | ...
	};
	options?: {
		className?: string;
	};
}

export interface TourStepRendererProps {
	steps: Steps;
	currentStepIndex: number;
	onDismiss: ( source: string ) => () => void;
	onNext: () => void;
	onPrevious: () => void;
	onMinimize: () => void;
	setInitialFocusedElement: React.Dispatch< React.SetStateAction< HTMLElement | null > >;
	onGoToStep: ( stepIndex: number ) => void;
}

export interface MinimizedTourRendererProps {
	steps: Steps;
	currentStepIndex: number;
	onMaximize: () => void;
	onDismiss: ( source: string ) => () => void;
}

export type Steps = Step[];
export type TourStepRenderer = React.FunctionComponent< TourStepRendererProps >;
export type MinimizedTourRenderer = React.FunctionComponent< MinimizedTourRendererProps >;
export type Callback = ( currentStepIndex: number ) => void;
export type CloseHandler = ( steps: Steps, currentStepIndex: number, source: string ) => void;
export type PopperModifier = Partial< Modifier< unknown, Record< string, unknown > > >;

export interface Callbacks {
	onMinimize?: Callback;
	onMaximize?: Callback;
	onGoToStep?: Callback;
	onNextStep?: Callback;
	onPreviousStep?: Callback;
	onStepView?: Callback; // called once per step view (initial step render)
}

export interface Options {
	className?: string;
	callbacks?: Callbacks;
	effects?: {
		spotlight?: { styles?: React.CSSProperties };
		arrowIndicator?: boolean; // defaults to true
		overlay?: boolean;
	};
	popperModifiers?: PopperModifier[];
}

export interface Config {
	steps: Steps;
	renderers: {
		tourStep: TourStepRenderer;
		tourMinimized: MinimizedTourRenderer;
	};
	closeHandler: CloseHandler;
	options?: Options;
}

export type Tour = React.FunctionComponent< { config: Config } >;

/************************
 * WPCOM variant types: *
 ************************/

export type OnTourRateCallback = ( currentStepIndex: number, liked: boolean ) => void;

export interface WpcomStep extends Step {
	meta: {
		heading: string | null;
		description: {
			desktop: string | null;
			mobile: string | null;
		};
		imgSrc: {
			desktop?: {
				src: string;
				type: string;
			};
			mobile?: {
				src: string;
				type: string;
			};
		};
	};
}

export interface WpcomCallbacks extends Callbacks {
	onTourRate?: OnTourRateCallback; // called when rating the tour (for the variant that provides tour rating)
}

export interface WpcomOptions extends Options {
	callbacks?: WpcomCallbacks;
}

export interface WpcomConfig extends Omit< Config, 'renderers' > {
	steps: WpcomStep[];
	options?: WpcomOptions;
}

export type WpcomTour = React.FunctionComponent< { config: WpcomConfig } >;
