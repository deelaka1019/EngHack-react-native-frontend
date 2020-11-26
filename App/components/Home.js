import React from "react";
import { StyleSheet} from 'react-native';
import ListingScreen from './ListingScreen';

export default function Home({ navigation }) {
	return (
		<ListingScreen navigation={navigation} />
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});