import { Text } from "react-native";

function TruncatedText({ text, maxLength, fontSize, styles }) {
    if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '...';
    }

    return <Text style={[styles, { fontSize: fontSize || 14, }]}>{text}</Text>;
}

export default TruncatedText