/**
 * WordPress dependencies
 */
import { focus } from '@wordpress/dom';
/**
 * External Dependencies
 */
import { useEffect, useCallback, useRef } from '@wordpress/element';

/**
 * A hook that constraints tabbing/focus on focuable elements in the given element ref.
 *
 * @param ref React.MutableRefObject< null | HTMLElement >
 */
const useFocusTrap = ( ref: React.MutableRefObject< null | HTMLElement > ): void => {
	const timeoutId = useRef< number >();

	const handleTrapFocus = useCallback(
		( event ) => {
			const { key, shiftKey, target } = event;
			if ( key !== 'Tab' || ! ref.current ) {
				return;
			}

			const action = shiftKey ? 'findPrevious' : 'findNext';
			const nextElement = focus.tabbable[ action ]( target ) || null;

			if ( ref.current?.contains( nextElement ) ) {
				return;
			}

			const domAction = shiftKey ? 'append' : 'prepend';
			const { ownerDocument } = ref.current;
			const trap = ownerDocument.createElement( 'div' );

			trap.tabIndex = -1;
			ref.current?.[ domAction ]( trap );
			trap.focus();
			timeoutId.current = setTimeout( () => ref.current?.removeChild( trap ) );
		},
		[ ref ]
	);

	useEffect( () => {
		document.addEventListener( 'keydown', handleTrapFocus );

		return () => {
			document.removeEventListener( 'keydown', handleTrapFocus );
			clearTimeout( timeoutId.current );
		};
	}, [ ref, handleTrapFocus, timeoutId ] );
};

export default useFocusTrap;
