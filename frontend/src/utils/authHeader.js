const authHeader = () => {
  const token = localStorage.getItem('token'); 
  if (token) {
    return { headers: { authorization: `Bearer ${token}` } };
  } else {
    return {};
  }
};

export default authHeader;