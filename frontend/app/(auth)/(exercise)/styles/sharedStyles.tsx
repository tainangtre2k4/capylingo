import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    alignItems: 'center',
  },
  question: {
    marginTop: width * 0.248,
    marginHorizontal: width*0.03,
    fontWeight: '400',
    fontSize: width * 0.06,
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  input: {
    height: height * 0.23,
    borderColor: '#C5BFBF',
    borderWidth: 1,
    width: width * 0.8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: width * 0.048,
    fontSize: width * 0.045,
  },
  checkAnswerButton: {
    width: '95%',
    height: width*0.128,
    backgroundColor: '#0693F1',
    borderRadius: width*0.1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: height*0.03,
  },
  textCheckAnswerButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },

  // Result Box
  resultBox: {
    padding: width*0.0267,
    width: '100%',
    //height: height*0.278,
    height: 'auto',
    paddingBottom: height*0.1,
    borderRadius: width* 0.03,
    position: 'absolute',
    bottom: height*0.015,
  },
  correctColor: {
    color: '#99CC29', // Màu xanh lá
  },
  incorrectColor: {
    color: '#FF2442', // Màu đỏ
  },
  answerBox:{
    
  },
  resultTitle:{
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: width*0.0213,
  },
  answerText: {
    fontSize: 18,
    padding: width*0.008,
    fontWeight: 'bold',
  },

});
