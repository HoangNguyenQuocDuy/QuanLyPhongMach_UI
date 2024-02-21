import { Text } from "react-native";

function TruncatedText({ text, maxLength }) {
    if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '...';
    }

    return <Text style={[{ fontSize: 14 }]}>{text}</Text>;
}

export default TruncatedText