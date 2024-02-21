import { useDispatch } from 'react-redux';
import { logout } from '../../store/slice/accountSlice';
import { useEffect } from 'react';

function LogoutScreen({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, []); 

  return null; 
}

export default LogoutScreen;
