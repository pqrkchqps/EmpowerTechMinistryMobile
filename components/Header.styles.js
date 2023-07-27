import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  header: {
    padding: '0px',
    height: '100px',
  },

  iconHidden: {
    display: 'none',
  },

  ul: {
    position: 'relative',
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0px',
    alignItems: 'center',
  },

  li: {
    padding: '12px',
    width: '44px',
    margin: '16px',
    height: '44px',
    borderRadius: '100%',
    fontSize: '32px',
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
});

export default styles;
