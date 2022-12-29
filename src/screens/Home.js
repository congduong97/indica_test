import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/userSlice';
import {COLORS} from '../utils/colors';
import {firebase} from '@react-native-firebase/database';
const DB =
  'https://indica-test-default-rtdb.asia-southeast1.firebasedatabase.app';
const Home = () => {
  const {userInfo} = useSelector(selectUser);

  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    const onChildAdd = firebase
      .app()
      .database(DB)
      .ref('/users')
      .on('child_added', snapshot => {
        setComment('');
        setCommentList(prev => [...prev, snapshot.val()]);
        console.log('A new node has been added', snapshot.val());
      });

    // Stop listening for updates when no longer required
    return () =>
      firebase.app().database(DB).ref('/users').off('child_added', onChildAdd);
  }, []);

  const onSave = async () => {
    try {
      const res = await firebase
        .app()
        .database(DB)
        .ref(`/users/${firebase.app().database(DB).ref('/users').push().key}`)
        .update({
          comment,
        });
      console.log('res', res);
    } catch (error) {
      console.log('errr', error);
    }
  };
  return (
    <ScrollView contentContainerStyle={{padding: 8}}>
      <Text style={styles.title}>{userInfo.displayName}</Text>
      <View>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={val => setComment(val)}
        />
        <Button title="Save" onPress={onSave} />
      </View>
      {commentList.map((c, index) => {
        return (
          <Text key={index + ''} style={styles.comment}>
            {c?.comment}
          </Text>
        );
      })}
    </ScrollView>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.WHITE,
  },
  title: {
    color: COLORS.GRAY_600,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.GRAY_400,
    width: '100%',
    padding: 0,
    marginBottom: 16,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  comment: {
    fontSize: 15,
    marginVertical: 4,
    color: COLORS.GRAY_600,
  },
});
