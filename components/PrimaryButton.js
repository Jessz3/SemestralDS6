import { Pressable, StyleSheet, Text } from 'react-native';
import Colors from '../styles/colors';

export default function PrimaryButton({ title, onPress, disabled = false, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 180,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.45 },
  text: { color: Colors.white, fontSize: 19, fontWeight: '700' },
});
