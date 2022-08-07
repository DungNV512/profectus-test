const initialState = {

}
const dummyReducer = (state = initialState, action) => {
  const { type } = action
  switch(type) {
    default:
      return state;
  }
}
export default dummyReducer