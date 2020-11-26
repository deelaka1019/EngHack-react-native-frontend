import React, { useEffect, useContext, useState } from 'react';
import { FlatList , StyleSheet } from 'react-native';
import axios from 'axios';

import { baseURL } from './baseURL';
import { AuthContext } from "./context";
import { Loading } from './Loading';
import Screen from '../components/Screen';
import Card from './Card';
import color from './color';

function ListingScreen(props) {

    const { username, password } = useContext(AuthContext);
	
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
    const [articles, setArticles] = useState();

    const image = require('../../assets/abus.png')

    const pullDownRefresh = () => {
		const user = {
			username: username,
			password: password
		};

		axios.post(`${baseURL}/articles`, user)
		.then((response) => {
			setIsLoading(false);
			setArticles(response.data);
			setError('');
		})
		.catch((err) => {
			setIsLoading(false);
			setArticles();
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
       <Screen style = {styles.screen}>
           <FlatList
                data = {articles}
                keyExtractor = {(item) =>item._id}
                renderItem = {({item}) => 
                    <Card 
                        title = {item.title}
                        description = {item.description}
                        image = {image}
                        navigation={props.navigation}
                    />
                }
                onRefresh={() => pullDownRefresh()}
			    refreshing={isLoading}
           />
       </Screen>
    );
}

const styles = StyleSheet.create({
    
    screen:{
        padding:20,
        backgroundColor:color.light
    }

 })

export default ListingScreen;