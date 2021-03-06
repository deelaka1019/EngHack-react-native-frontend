import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import axios from 'axios';

import { baseURL } from './baseURL';
import { AuthContext } from "./context";
import { Loading } from './Loading';

const readingList = ((username,password,item,navigation) => {
	return(
		<Card
			style={styles.notificationCard}
			onPress={() => {
				navigation.push("Read",{item});
				increaseCount(username,password,item.views,item._id);
			}}
		>
			<View style={styles.notificationCardContent}>
				<Text>Date : {item.date}</Text>
				<Text style={styles.cardTextNotifications}>{item.title}</Text>
			</View>
		</Card>
	);
})

const increaseCount = (username,password,views,_id) => {
	var newView = views + 1;

	const user = {
		username: username,
		password: password,
		views: newView,
		_id:_id
	};

	axios.post(`${baseURL}/readings/views`, user)
	.then((res) => {
		console.log(res.data);
	})
	.catch((err) => {
		console.log("Error",`Increasing number of views failed! ${err.response.data.msg}`);
	});
}

export default function Reading({ navigation }) {

	const { username, password } = useContext(AuthContext);
	
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [readings, setReadings] = useState();

	const pullDownRefresh = () => {
		const user = {
			username: username,
			password: password
		};

		axios.post(`${baseURL}/readings`, user)
		.then((response) => {
			setIsLoading(false);
			setReadings(response.data);
			setError('');
		})
		.catch((err) => {
			setIsLoading(false);
			setReadings();
			setError(`Error - ${err}! Reload the App. If it doesn't work, you need to Sign In again!`);
		});
	}

	useEffect(() => {
		pullDownRefresh();
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return (
			<ScrollView>
				<Text>{error}</Text>
			</ScrollView>
		);
	}
	
	return (
		<FlatList
			data={readings}
			renderItem={({item}) => {return readingList(username,password,item,navigation)}}
			keyExtractor={(item)=>`${item._id}`}
			onRefresh={() => pullDownRefresh()}
			refreshing={isLoading}
		/>
	);
}

const styles = StyleSheet.create({
	cardTextNotifications:{
		margin:3,
		marginLeft: 5,
		marginRight: 5,
		paddingTop:5,
		paddingBottom:5,
		fontWeight:"bold",
		color:"#55585c"
	},
	notificationCard:{
		marginTop:10,
		marginLeft:10,
		marginRight:10,
		padding:15,
		backgroundColor:"white"
	},
	notificationCardContent:{
		padding:3
	}
});