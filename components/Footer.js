import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';

const HELP_DURATION = 3000;
const FADE_DURATION = 400;

export default function Footer({
	helpText,
	containerStyle,
}) {
	const [visibleText, setVisibleText] = useState(null);
	const [muted, setMuted] = useState(false);

	const opacity = useRef(new Animated.Value(0)).current;
	const hideTimeout = useRef(null);

	useEffect(() => {
		return () => {
			if (hideTimeout.current) {
				clearTimeout(hideTimeout.current);
			}
		};
	}, []);

	const handleHelpPress = () => {
		if (!helpText) {
			return;
		}

		if (hideTimeout.current) {
			clearTimeout(hideTimeout.current);
		}

		setVisibleText(helpText);
		opacity.setValue(1);

		hideTimeout.current = setTimeout(() => {
			Animated.timing(opacity, {
				toValue: 0,
				duration: FADE_DURATION,
				useNativeDriver: true,
			}).start(() => setVisibleText(null));
		}, HELP_DURATION);
	};

	const toggleMuted = () => {
		setMuted((current) => !current);
	};

	return (
		<View style={[styles.container, containerStyle]}>
			<Pressable
				onPress={handleHelpPress}
				style={styles.sideButton}
			>
				<Image
					source={require('../assets/img/FELIZ_Figuralicia.png')}
					style={styles.sideImage}
					resizeMode="contain"
				/>
			</Pressable>

			<View style={styles.helpTextContainer}>
				{visibleText && (
					<Animated.Text
						style={[styles.helpText, { opacity }]}
						numberOfLines={2}
					>
						{visibleText}
					</Animated.Text>
				)}
			</View>

			<Pressable
				onPress={toggleMuted}
				style={styles.sideButton}
			>
				<Image
					source={
						muted
							? require('../assets/img/MUTE.png')
							: require('../assets/img/MUSICA.png')
					}
					style={styles.sideImage}
					resizeMode="contain"
				/>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},

	sideButton: {
		width: 60,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},

	sideImage: {
		width: 65,
		height: 65,
	},

	helpTextContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	helpText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#FBAB20',
		textAlign: 'center',
	},
});
