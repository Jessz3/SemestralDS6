import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Header({
	title,
	onPause,
	titleStyle,
	containerStyle,
}) {
	return (
		<View style={[styles.container, containerStyle]}>
			<Text style={[styles.title, titleStyle]}>
				{title}
			</Text>

			{onPause && (
				<Pressable
					onPress={onPause}
					style={styles.pauseButton}
				>
					<Image
						source={require('../assets/img/PAUSA.png')}
						style={styles.pauseImage}
						resizeMode="contain"
					/>
				</Pressable>
			)}
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

	title: {
		flex: 1,
		textAlign: 'center',
	},

	pauseButton: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},

	pauseImage: {
		width: 60,
		height: 60,
	},
});
